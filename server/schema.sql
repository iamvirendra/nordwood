CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  csrf_token CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX sessions_expiry (expires_at),
  INDEX sessions_user (user_id),
  CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX password_resets_expiry (expires_at),
  INDEX password_resets_user (user_id),
  CONSTRAINT password_resets_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  hits INT UNSIGNED NOT NULL DEFAULT 1,
  resets_at DATETIME(3) NOT NULL,
  INDEX rate_limits_expiry (resets_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
  user_id INT UNSIGNED NOT NULL,
  request_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  request_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  status ENUM('pending','confirmed','in_production','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(12,2) UNSIGNED NOT NULL,
  shipping_name VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(25) NOT NULL,
  shipping_address VARCHAR(500) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(20) NOT NULL,
  notes VARCHAR(2000) NOT NULL DEFAULT '',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY orders_idempotency (user_id, request_id),
  INDEX orders_status_created (status, created_at),
  CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  wood_type VARCHAR(100) NOT NULL,
  size VARCHAR(100) NOT NULL,
  image VARCHAR(1000) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  unit_price DECIMAL(12,2) UNSIGNED NOT NULL,
  line_total DECIMAL(12,2) UNSIGNED NOT NULL,
  CONSTRAINT order_items_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_status_history (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  actor_id INT UNSIGNED NOT NULL,
  from_status VARCHAR(20) NOT NULL,
  to_status VARCHAR(20) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT history_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT history_actor_fk FOREIGN KEY (actor_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
