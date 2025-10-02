CREATE DATABASE pcshop;
USE pcshop;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) DEFAULT '',
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(200) DEFAULT '',
    password VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1,
    date_of_birth DATE
);

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE users ADD COLUMN role_id INT DEFAULT 2;
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id);

INSERT INTO roles (id, name) VALUES 
(1, 'ADMIN'),
(2, 'USER'),


CREATE TABLE tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) UNIQUE NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expiration_date DATETIME,
    revoked TINYINT(1) NOT NULL DEFAULT 0,
    expired TINYINT(1) NOT NULL DEFAULT 0,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Brand name (AMD, Intel, NVIDIA, etc.)',
    description TEXT DEFAULT '',
    logo_url VARCHAR(300) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE DEFAULT '' COMMENT 'Category name (CPU, GPU, RAM, etc.)',
    description TEXT DEFAULT ''
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(350) NOT NULL COMMENT 'Product name',
    price FLOAT NOT NULL CHECK(price >= 0),
    discount FLOAT DEFAULT 0 CHECK(discount >= 0 AND discount <= 100),
    stock_quantity INT DEFAULT 0 CHECK(stock_quantity >= 0),
    thumbnail VARCHAR(300) DEFAULT '',
    description LONGTEXT DEFAULT '',
    warranty_months INT DEFAULT 12,
    is_active TINYINT DEFAULT 1,
    is_featured TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    category_id INT NOT NULL,
    brand_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(300) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK(quantity > 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    fullname VARCHAR(100) DEFAULT '',
    email VARCHAR(150) DEFAULT '',
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(200) NOT NULL,
    note VARCHAR(500) DEFAULT '',
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT 'Order status',
    total_price FLOAT NOT NULL CHECK(total_price >= 0),
    payment_method VARCHAR(100) DEFAULT 'cash_on_delivery',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_method VARCHAR(100) DEFAULT 'standard',
    tracking_number VARCHAR(100) DEFAULT '',
    shipping_address VARCHAR(200) DEFAULT '',
    shipping_date DATE,
    active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    price FLOAT NOT NULL CHECK(price >= 0),
    quantity INT NOT NULL CHECK(quantity > 0),
    total_price FLOAT NOT NULL CHECK(total_price >= 0),
    product_name VARCHAR(350) DEFAULT '' COMMENT 'Product name at time of purchase',
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
