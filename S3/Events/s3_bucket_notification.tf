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

## SNS Topic ##
###############

resource "aws_sns_topic" "event_topic" {
  name = "s3-event-topic"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["SNS:Publish"]
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Resource = "arn:aws:sns:*:*:s3-event-topic"
        Condition = {
          ArnLike = { "aws:SourceArn" = "${aws_s3_bucket.sample_event_bucket.arn}" }
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "sqs_subscription_target" {
  topic_arn = aws_sns_topic.event_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.sqs_queue.arn
}

## SQS Queue ##
###############

resource "aws_sqs_queue" "sqs_queue" {
  name                      = "topic-subscription-queue"
  message_retention_seconds = 60
}

resource "aws_sqs_queue_policy" "allow_sns_send_message" {
  queue_url = aws_sqs_queue.sqs_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "sqs policy"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "sns.amazonaws.com"
      }
      Action   = "sqs:SendMessage"
      Resource = "${aws_sqs_queue.sqs_queue.arn}"
      Condition = {
        ArnEquals = {
          "aws:SourceArn" : "${aws_sns_topic.event_topic.arn}"
        }
      }
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = "${aws_sqs_queue.sqs_queue.arn}"
        Condition = {
          ArnEquals = {
            "aws:SourceArn" : "${aws_s3_bucket.sample_event_bucket.arn}"
          }
        }
    }]
  })
}

## Bucket Event ##
##################

# Note that multiple notifications for the same bucket
# have to be contained within the same 'aws_s3_bucket_notification'
# block, or they will override one another.
resource "aws_s3_bucket_notification" "bucket_notifications" {
  bucket = aws_s3_bucket.sample_event_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.filename_logger_lambda.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "lambda/"
    filter_suffix       = ".txt"
  }

  topic {
    topic_arn     = aws_sns_topic.event_topic.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "sns/"
    filter_suffix = ".txt"
  }

  queue {
    queue_arn     = aws_sqs_queue.topic_subscription_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "sqs/"
    filter_suffix = ".txt"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}
