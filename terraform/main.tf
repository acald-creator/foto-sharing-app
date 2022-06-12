data "aws_availability_zones" "available" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"
  # insert the 23 required variables here
  name                 = "photo-share-vpc"
  cidr                 = "10.0.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_db_subnet_group" "photo_share_subnet_group" {
  name       = "photo-share-subnet-group"
  subnet_ids = module.vpc.public_subnets

  tags = {
    Name = "photo-share-subnet"
  }
}

resource "aws_security_group" "photo_share_rds_security_group" {
  name = "photo-share-rds-security-group"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "photo-share-rd-sg"
  }
}

resource "aws_db_parameter_group" "photo_share_rds_parameter_group" {
  name   = "photo-share-dev"
  family = "postgres13"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_db_instance" "photo_share_rds_db_instance" {
  identifier             = "photoshare"
  instance_class         = "db.t3.micro"
  allocated_storage      = 5
  engine                 = "postgres"
  engine_version         = "13.6"
  username               = "foto"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.photo_share_subnet_group.name
  vpc_security_group_ids = [aws_security_group.photo_share_rds_security_group.id]
  parameter_group_name   = aws_db_parameter_group.photo_share_rds_parameter_group.name
  publicly_accessible    = true
  skip_final_snapshot    = true
}