-- Ensure database exists with correct charset.
-- Table creation is handled by Rails migrations (rails db:migrate).
CREATE DATABASE IF NOT EXISTS expense_system_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE expense_system_development;
