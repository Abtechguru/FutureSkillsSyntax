provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "futureskills" {
  identifier             = "futureskills-prod"
  engine                 = "postgres"
  engine_version         = "15.3"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  db_name                = "futureskills_prod"
  username               = var.db_username
  password               = var.db_password
  parameter_group_name   = aws_db_parameter_group.futureskills.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = true
  skip_final_snapshot    = true
  backup_retention_period = 7
  performance_insights_enabled = true
}

resource "aws_db_parameter_group" "futureskills" {
  name   = "futureskills-postgres15"
  family = "postgres15"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_security_group" "rds" {
  name        = "futureskills-rds-sg"
  description = "Allow inbound PostgreSQL traffic"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "db_username" {
  description = "Database administrator username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

output "rds_endpoint" {
  value = aws_db_instance.futureskills.endpoint
}