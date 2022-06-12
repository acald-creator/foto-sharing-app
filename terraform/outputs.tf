output "rds_hostname" {
  description = "AWS RDS instance hostname"
  value       = aws_db_instance.photo_share_rds_db_instance.address
  sensitive   = true
}

output "rds_port" {
  description = "AWS RDS instance port"
  value       = aws_db_instance.photo_share_rds_db_instance.port
  sensitive   = true
}

output "rds_username" {
  description = "AWS RDS root username"
  value       = aws_db_instance.photo_share_rds_db_instance.username
  sensitive   = true
}