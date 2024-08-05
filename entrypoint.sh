#!/bin/bash
set -e
# entrypoint.sh

# Check if MySQL is running
if pgrep mysqld > /dev/null
then
    echo "MySQL is already running"
else
    # Start MySQL service
    service mysql start

    # Wait for MySQL to start
    sleep 5

    # Create the MySQL database and user if they don't exist
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS $HBNB_MYSQL_DB;"
    mysql -u root -e "CREATE USER IF NOT EXISTS '$HBNB_MYSQL_USER'@'localhost' IDENTIFIED BY '$HBNB_MYSQL_PWD';"
    mysql -u root -e "GRANT ALL PRIVILEGES ON $HBNB_MYSQL_DB.* TO '$HBNB_MYSQL_USER'@'localhost';"
    mysql -u root -e "FLUSH PRIVILEGES;"
fi

if [ -z "$(mysql -u root -p${HBNB_MYSQL_PWD} -e 'SHOW TABLES;' ${HBNB_MYSQL_DB})" ]; then
    echo "Importing database dump..."
    mysql -u root -p${HBNB_MYSQL_PWD} ${HBNB_MYSQL_DB} < /docker-entrypoint-initdb.d/hbnb_dump.sql
fi

# Export PYTHONPATH
export PYTHONPATH="/usr/src/app"

# Launch the API server in the background
echo "Launching API server..."
cd api/v1/
python3 app.py &
api_pid=$!

# Allow some time for the API server to start
sleep 10

# Launch the web application
echo "Launching web application..."
cd ../../web_dynamic/
python3 4-hbnb.py

# Execute the passed command or keep the container running
exec "$@" || wait $api_pid || tail -f /dev/null