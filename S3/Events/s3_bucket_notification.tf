## S3 Bucket ##
###############

resource "aws_s3_bucket" "sample_event_bucket" {
  bucket        = "test-bucket-for-s3-events"
  force_destroy = true

  tags = {
    Source = "AWS-Learning"
  }
}

## IAM Roles / Policies ##
##########################

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

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.filename_logger_lambda.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.sample_event_bucket.arn
}

## Lambda Function ##
#####################

data "archive_file" "lambda_source" {
  type        = "zip"
  source_file = "${path.module}/filename_logger_lambda.py"
  output_path = "${path.module}/filename_logger_lambda.zip"
}

resource "aws_lambda_function" "filename_logger_lambda" {
  filename      = "filename_logger_lambda.zip"
  function_name = "filename_logger_lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "filename_logger_lambda.handle_file_created_event"
  runtime       = "python3.9"
}

## Bucket Event ##
##################

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.sample_event_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.filename_logger_lambda.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "lambda/"
    filter_suffix       = ".txt"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}
