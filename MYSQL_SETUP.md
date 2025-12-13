# MySQL Setup Instructions

## Option 1: Reset Root Password (if you forgot it)

1. Stop MySQL:
   ```bash
   brew services stop mysql
   ```

2. Start MySQL in safe mode:
   ```bash
   mysqld_safe --skip-grant-tables &
   ```

3. Connect without password:
   ```bash
   mysql -u root
   ```

4. Reset the password:
   ```sql
   USE mysql;
   UPDATE user SET authentication_string=PASSWORD('yourpassword') WHERE User='root';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. Stop safe mode and restart normally:
   ```bash
   pkill mysqld_safe
   brew services start mysql
   ```

## Option 2: Use No Password (Local Development Only)

1. Connect to MySQL (try without password first):
   ```bash
   mysql -u root
   ```

2. If it works, create the database:
   ```sql
   CREATE DATABASE apartment_db;
   EXIT;
   ```

3. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.password=
   ```
   (Leave password empty)

## Option 3: Set New Password

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
   (Enter your current password, or press Enter if no password)

2. Set new password:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
   FLUSH PRIVILEGES;
   ```

3. Create database:
   ```sql
   CREATE DATABASE apartment_db;
   EXIT;
   ```

4. Update `backend/src/main/resources/application.properties` with your password:
   ```properties
   spring.datasource.password=yourpassword
   ```

## Verify Setup

After setting up, test the connection:
```bash
mysql -u root -p apartment_db
```

Then run your Spring Boot application - it will auto-create the tables!



