-- Setup script for Apartment Management System Database

-- Create the database
CREATE DATABASE IF NOT EXISTS apartment_db;

-- Use the database
USE apartment_db;

-- Note: If you need to set/reset root password, run these commands separately:
-- ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
-- FLUSH PRIVILEGES;

-- The database is ready. Spring Boot will auto-create tables via JPA/Hibernate.

