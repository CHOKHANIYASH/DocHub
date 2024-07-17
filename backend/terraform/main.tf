provider "aws" {
    region = "ap-south-1"
}
resource "aws_s3_bucket" "dochub_bucket"{
    bucket = "yash-dochub-bucket"
}
resource "aws_s3_bucket_public_access_block" "dochub_bucket_public_access"{
    bucket = aws_s3_bucket.dochub_bucket.bucket
}
resource "aws_s3_bucket_policy" "dochub_bucket_policy"{
    bucket = aws_s3_bucket.dochub_bucket.bucket
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Principal = "*"
                Action = "s3:GetObject"
                Resource = "${aws_s3_bucket.dochub_bucket.arn}/*"
            }
        ]
    })
}
data "aws_iam_policy_document" "lambda_role_policy" {
    statement {
      effect = "Allow"
      principals {
        type = "Service"
        identifiers = ["lambda.amazonaws.com"]
      }
      actions = ["sts:AssumeRole"]
    }
}
resource "aws_iam_role" "dochub_lambda_role" {
  name = "dochub_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json
}
resource "aws_lambda_function" "dochub_server" {
  function_name = "dochub_server"
  role = aws_iam_role.dochub_lambda_role.arn
  package_type = "Image"
  image_uri = "225542105072.dkr.ecr.ap-south-1.amazonaws.com/dochub:dochub-server"
}
resource "aws_cloudwatch_log_group" "lambda_log_group_dochub" { // CloudWatch log group creation for image resizer lambda
  name              = "/aws/lambda/${aws_lambda_function.dochub_server.function_name}"
  retention_in_days = 14
}
data "aws_iam_policy_document" "lambda_logs_policy" { // IAM policy for lambda to write logs to CloudWatch data
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}
resource "aws_iam_policy" "dochub_lambda_logs_policy" { // IAM policy for lambda to write logs to CloudWatch
  name        = "dochub_lambda_logs_policy"
  description = "IAM policy for lambda to write logs to CloudWatch"
  policy      = data.aws_iam_policy_document.lambda_logs_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" { // IAM role policy attachment for lambda to write logs to CloudWatch
  role       = aws_iam_role.dochub_lambda_role.name
  policy_arn = aws_iam_policy.dochub_lambda_logs_policy.arn
}