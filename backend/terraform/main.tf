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