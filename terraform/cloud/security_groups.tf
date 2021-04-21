resource "aws_security_group" "allow_all_egress" {
    name = "${terraform.workspace}-allow-all-egress"
    vpc_id = aws_vpc.main_network.id

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_security_group" "allow_postgres_ingress" {
    name   = "${terraform.workspace}-allow-postgres-ingress"
    vpc_id = aws_vpc.main_network.id

    ingress {
        from_port   = 0
        to_port     = 5432
        protocol    = "6" # TCP
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_security_group" "allow_https_ingress" {
    name   = "${terraform.workspace}-allow-https-ingress"
    vpc_id = aws_vpc.main_network.id

    ingress {
        from_port   = 443
        to_port     = 443
        protocol    = "6" # TCP
        cidr_blocks = ["0.0.0.0/0"]
    }
}