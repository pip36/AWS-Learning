resource "aws_apigatewayv2_api" "api-gateway" {
  name          = "simple-http-api"
  protocol_type = "HTTP"
  description   = "A simple HTTP api-gateway, to experiment with."
  cors_configuration {
    allow_methods = ["OPTIONS", "GET", "PUT", "POST", "DELETE"]
    allow_headers = ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token"]
    allow_origins = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "dev-stage" {
  api_id      = aws_apigatewayv2_api.api-gateway.id
  name        = "dev-stage"
  auto_deploy = true
}

resource "aws_apigatewayv2_authorizer" "authorizer" {
  api_id           = aws_apigatewayv2_api.api-gateway.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "basic-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.appclient.id]
    issuer   = "https://${aws_cognito_user_pool.userpool.endpoint}"
  }
}


module "IAM" {
  source = "./modules/IAM"
}

/* 
  Currently when adding an endpoint it is expected that
  `/api/{name}.py` will exist. 
*/
module "endpoints" {
  source = "./modules/Endpoint"
  for_each = {
    "hello" = {
      policy_arns = [module.IAM.write_logs_policy_arn]
    },
    "goodbye" = {
      policy_arns = [module.IAM.write_logs_policy_arn]
    }
  }
  api_gateway_id            = aws_apigatewayv2_api.api-gateway.id
  api_gateway_execution_arn = aws_apigatewayv2_api.api-gateway.execution_arn
  api_gateway_authorizer_id = aws_apigatewayv2_authorizer.authorizer.id
  function_name             = each.key
  policy_arns               = each.value.policy_arns
}
