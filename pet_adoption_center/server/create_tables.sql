-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Insert sample products
INSERT INTO products (name, description, category, price, stock, quantity, image_url) VALUES
('Premium Dog Food', 'High quality dog food made with natural ingredients for healthy growth', 'Food', 25.99, 12, 12, 'https://www.prodograw.com/wp-content/uploads/2024/06/Complete-Chicken-tub-angled-web.png'),
('Cat Scratching Post', 'Durable scratching post to keep cats active and protect furniture', 'Accessories', 18.50, 5, 5, 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91'),
('Dog Leash', 'Strong and comfortable leash for daily walks', 'Accessories', 12.99, 8, 8, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1'),
('Cat Food Bowl', 'Stainless steel food bowl for cats', 'Accessories', 8.99, 15, 15, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee'),
('Dog Toy Ball', 'Interactive rubber ball for dogs', 'Toys', 6.99, 20, 20, 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea');