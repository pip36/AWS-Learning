data "aws_iam_policy_document" "logs_write_access" {
  statement {
    sid = "1"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      "arn:aws:logs:*:*:*",
    ]
  }
}

resource "aws_iam_policy" "logs_write_access" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = data.aws_iam_policy_document.logs_write_access.json
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  managed_policy_arns = [aws_iam_policy.logs_write_access.arn]

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

## Lambda Function ##
#####################
data "archive_file" "lambda_source" {
  type        = "zip"
  source_dir = "${path.module}/src/SimpleFSharp/bin/Release/netcoreapp3.1"
  output_path = "${path.module}/bundle.zip"
}

resource "aws_lambda_function" "simple_fsharp_lambda" {
  filename      = "bundle.zip"
  function_name = "simple_fsharp_lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "SimpleFSharp::SimpleFSharp.Function::FunctionHandler"
  runtime       = "dotnetcore3.1"
}

