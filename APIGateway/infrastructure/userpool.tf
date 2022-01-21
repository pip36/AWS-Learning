resource "aws_cognito_user_pool" "userpool" {
  name                     = "app-userpool"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
}

resource "aws_cognito_user_pool_client" "appclient" {
  name                          = "UI-Application"
  user_pool_id                  = aws_cognito_user_pool.userpool.id
  explicit_auth_flows           = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"
}
