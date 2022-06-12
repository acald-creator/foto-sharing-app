variable "region" {
  default     = "us-east-2"
  description = "Choose AWS Region"
}

variable "db_password" {
  sensitive   = true
  description = "AWS RDS root user password"
}