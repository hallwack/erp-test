CREATE USER n8n_user WITH PASSWORD 'password';
CREATE DATABASE n8n_database OWNER n8n_user;

CREATE USER laravel_user WITH PASSWORD 'password';
CREATE DATABASE laravel_db OWNER laravel_user;
