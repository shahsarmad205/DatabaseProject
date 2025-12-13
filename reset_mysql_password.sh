#!/bin/bash
# Script to reset MySQL root password

echo "Stopping MySQL..."
killall -9 mysqld mysqld_safe 2>/dev/null
sleep 3

echo "Starting MySQL in safe mode..."
cd /opt/homebrew
./opt/mysql/bin/mysqld_safe --skip-grant-tables --skip-networking > /dev/null 2>&1 &
sleep 5

echo "Resetting password..."
mysql -u root << 'EOF'
USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
FLUSH PRIVILEGES;
EXIT;
EOF

echo "Stopping safe mode..."
killall -9 mysqld mysqld_safe
sleep 2

echo "Starting MySQL normally..."
nohup ./opt/mysql/bin/mysqld_safe --datadir=./var/mysql --user=$(whoami) --bind-address=127.0.0.1 > /dev/null 2>&1 &
sleep 8

echo "Testing connection..."
if mysql -u root -pyourpassword -e "SELECT 'SUCCESS' AS status;" 2>/dev/null | grep -q SUCCESS; then
    echo "✓ MySQL password reset successful!"
    mysql -u root -pyourpassword -e "CREATE DATABASE IF NOT EXISTS apartment_db;"
    echo "✓ Database 'apartment_db' ready"
else
    echo "✗ Password reset may have failed. You may need to set it manually."
fi


