# Lambda Function

data "archive_file" "lambda_source" {
  type        = "zip"
  source_file = "../api/${var.function_name}.py"
  output_path = "${path.module}/bundle.zip"
}

resource "aws_lambda_function" "lambda" {
  filename         = data.archive_file.lambda_source.output_path
  source_code_hash = data.archive_file.lambda_source.output_base64sha256
  function_name    = var.function_name
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "${var.function_name}.handle"
  runtime          = "python3.9"
  depends_on = [
    data.archive_file.lambda_source
  ]
}

resource "aws_lambda_permission" "allow-gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${var.api_gateway_execution_arn}/*/*"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.function_name}_lambda_execution_role"

  managed_policy_arns = var.policy_arns

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["sts:AssumeRole"]
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
      },
    ]
  })
}

# API Gateway Endpoint
resource "aws_apigatewayv2_integration" "integration" {
  api_id = var.api_gateway_id

  integration_uri    = aws_lambda_function.lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "route" {
  api_id = var.api_gateway_id

  route_key          = "GET /${var.function_name}"
  target             = "integrations/${aws_apigatewayv2_integration.integration.id}"
  authorization_type = "JWT"
  authorizer_id      = var.api_gateway_authorizer_id
}
