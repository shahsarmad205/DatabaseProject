-- Apartment Management System Database Schema
-- Created for Final Project

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS apartment_management;
CREATE DATABASE apartment_management;
USE apartment_management;

-- Table: Buildings
CREATE TABLE buildings (
    building_id INT PRIMARY KEY AUTO_INCREMENT,
    building_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    total_units INT NOT NULL,
    year_built INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Apartments/Units
CREATE TABLE apartments (
    apartment_id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    floor_number INT,
    bedrooms INT NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    square_feet INT,
    rent_amount DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(building_id) ON DELETE CASCADE,
    UNIQUE KEY unique_unit (building_id, unit_number)
);

-- Table: Tenants/Residents
CREATE TABLE tenants (
    tenant_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Leases
CREATE TABLE leases (
    lease_id INT PRIMARY KEY AUTO_INCREMENT,
    apartment_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    lease_status ENUM('active', 'expired', 'terminated', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    CHECK (end_date > start_date)
);

-- Table: Payments
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    lease_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type ENUM('rent', 'deposit', 'late_fee', 'maintenance', 'other') DEFAULT 'rent',
    payment_method ENUM('check', 'credit_card', 'debit_card', 'cash', 'bank_transfer', 'online') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES leases(lease_id) ON DELETE CASCADE
);

-- Table: Maintenance Requests
CREATE TABLE maintenance_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    apartment_id INT NOT NULL,
    tenant_id INT NOT NULL,
    request_type ENUM('plumbing', 'electrical', 'heating', 'appliance', 'pest_control', 'other') NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    cost DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);

-- Table: Staff/Employees
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('manager', 'maintenance', 'admin', 'receptionist') NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Maintenance Assignments
CREATE TABLE maintenance_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    staff_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    FOREIGN KEY (request_id) REFERENCES maintenance_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
);

-- Table: Documents
CREATE TABLE documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    lease_id INT,
    tenant_id INT,
    document_type ENUM('lease_agreement', 'id', 'proof_of_income', 'application', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES leases(lease_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_apartment_building ON apartments(building_id);
CREATE INDEX idx_apartment_status ON apartments(status);
CREATE INDEX idx_lease_tenant ON leases(tenant_id);
CREATE INDEX idx_lease_apartment ON leases(apartment_id);
CREATE INDEX idx_lease_status ON leases(lease_status);
CREATE INDEX idx_payment_lease ON payments(lease_id);
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_maintenance_apartment ON maintenance_requests(apartment_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_tenant_email ON tenants(email);

-- Insert sample data (optional - for testing)
INSERT INTO buildings (building_name, address, city, state, zip_code, total_units, year_built) VALUES
('Sunset Apartments', '123 Main Street', 'Los Angeles', 'CA', '90001', 50, 2010),
('Riverside Complex', '456 Oak Avenue', 'San Francisco', 'CA', '94102', 75, 2015);

INSERT INTO apartments (building_id, unit_number, floor_number, bedrooms, bathrooms, square_feet, rent_amount, status) VALUES
(1, '101', 1, 1, 1.0, 650, 1200.00, 'available'),
(1, '102', 1, 2, 1.5, 900, 1500.00, 'available'),
(1, '201', 2, 2, 2.0, 1100, 1800.00, 'occupied'),
(2, '301', 3, 1, 1.0, 700, 1300.00, 'available'),
(2, '302', 3, 3, 2.5, 1400, 2200.00, 'available');

INSERT INTO tenants (first_name, last_name, email, phone, emergency_contact_name, emergency_contact_phone) VALUES
('John', 'Doe', 'john.doe@email.com', '555-0101', 'Jane Doe', '555-0102'),
('Alice', 'Smith', 'alice.smith@email.com', '555-0201', 'Bob Smith', '555-0202');

INSERT INTO staff (first_name, last_name, email, phone, role, hire_date, salary) VALUES
('Michael', 'Johnson', 'michael.johnson@apartments.com', '555-1001', 'manager', '2020-01-15', 60000.00),
('Sarah', 'Williams', 'sarah.williams@apartments.com', '555-1002', 'maintenance', '2021-03-20', 45000.00);

