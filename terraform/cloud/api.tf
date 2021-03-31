data "external" "api_code_zip" {
  program = [ "${path.module}/../../services/api/package.sh" ]
}

resource "aws_s3_bucket_object" "api_code_zip" {
  bucket = aws_s3_bucket.resources.id
  key    = "code/lambdas/api.zip"
  source = "${path.module}/../../services/api/lambda.zip"
  etag = data.external.api_code_zip.result.hash

  depends_on = [
    data.external.api_code_zip,
    aws_s3_bucket.resources
  ]
}

resource "aws_lambda_function" "api" {
   function_name = "${terraform.workspace}-api"

   s3_bucket = aws_s3_bucket.resources.id
   s3_key    = aws_s3_bucket_object.api_code_zip.id
   source_code_hash = data.external.api_code_zip.result.hash

   handler = "dist/src/main.handle"
   runtime = "nodejs14.x"
   timeout = 30
   memory_size = 256

   role = aws_iam_role.api_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      NO_COLOR = 1
      API_LAMBDA = 1
      API_GRAPHQL_DEBUG = 1
      API_GRAPHQL_PLAYGROUND = 1
      API_GRAPHQL_SCHEMA_INTROSPECTION = 1
      DB_URL = "postgresql://${var.postgres_cluster_root_user}:${var.postgres_cluster_root_password}@${aws_rds_cluster.postgres.endpoint}:${aws_rds_cluster.postgres.port}/${var.postgres_cluster_database_name}?connect_timeout=30&pool_timeout=30"
      API_MESSAGING_TOPICS = "submission=${module.messaging.submission_topic_arn}"
      API_MESSAGING_REGION = "eu-central-1"
      # vpce-011086f31c3f10c65-w5sx3202.sns.eu-central-1.vpce.amazonaws.com
      API_MESSAGING_ENDPOINT = "https://${aws_vpc_endpoint.sns.dns_entry[0]["dns_name"]}"
    }
  }

  vpc_config {
    subnet_ids         = [ 
        aws_subnet.postgres_cluster_network_zone_a.id,
        aws_subnet.postgres_cluster_network_zone_b.id,
        aws_subnet.postgres_cluster_network_zone_c.id
    ]
    security_group_ids = [ aws_security_group.allow_all_egress.id ]
  }

  depends_on = [
    aws_subnet.postgres_cluster_network_zone_a,
    aws_subnet.postgres_cluster_network_zone_b,
    aws_subnet.postgres_cluster_network_zone_c,
    aws_security_group.allow_all_egress
  ]
}

resource "aws_iam_role" "api_role" {
   name = "${terraform.workspace}-api-role"
   description = "IAM Role for executing a Lambda"

   assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "api_lambda_logs" {
  role       = aws_iam_role.api_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "api_vpc_access" {
  role       = aws_iam_role.api_role.name
  policy_arn = aws_iam_policy.vpc_access.arn
}

resource "aws_iam_role_policy_attachment" "api_submission_topic_publishing" {
  role       = aws_iam_role.api_role.name
  policy_arn = aws_iam_policy.submission_topic_publishing.arn
}


resource "aws_lambda_permission" "api_gateway_api" {
   statement_id  = "${terraform.workspace}-allow-api-gateway-invoke-api"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.api.function_name
   principal     = "apigateway.amazonaws.com"

   source_arn = "${aws_apigatewayv2_api.api_http_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_api" "api_http_api" {
  name          = "${terraform.workspace}-api-http-api"
  protocol_type = "HTTP"
  target        = aws_lambda_function.api.invoke_arn
}
