USE pcshop;

ALTER TABLE categories AUTO_INCREMENT = 1;

INSERT INTO categories (name, description)
VALUES
('PC Gaming, đồ họa', 'Máy tính cấu hình cao phục vụ chơi game và thiết kế đồ họa'),
('PC Văn phòng', 'Máy tính hiệu năng ổn định cho học tập và công việc văn phòng'),
('Máy ảo', 'Máy tính chuyên dụng để chạy máy ảo hoặc server mini'),
('CPU', 'Bộ xử lý trung tâm quyết định hiệu năng máy tính'),
('Mainboard', 'Bo mạch chủ kết nối và điều khiển các linh kiện'),
('RAM', 'Bộ nhớ tạm thời giúp tăng tốc xử lý'),
('GPU', 'Card đồ họa cho chơi game, thiết kế và AI'),
('Ổ cứng', 'Thiết bị lưu trữ dung lượng lớn'),
('PSU', 'Bộ nguồn cung cấp điện cho toàn bộ hệ thống'),
('Case', 'Vỏ máy tính chứa và bảo vệ các linh kiện bên trong'),
('Tản nhiệt CPU', 'Giúp làm mát CPU, tăng tuổi thọ linh kiện'),
('Màn hình', 'Thiết bị hiển thị hình ảnh'),
('Bàn phím', 'Thiết bị nhập liệu phổ biến cho máy tính'),
('Chuột', 'Thiết bị điều khiển con trỏ trên màn hình'),
('Tai nghe', 'Phụ kiện âm thanh cho chơi game, làm việc'),
('Loa', 'Thiết bị phát âm thanh ngoài');

INSERT INTO brands (id, name, description, created_at) VALUES
(3, 'MSI', 'MSI là thương hiệu công nghệ Đài Loan chuyên về laptop gaming, bo mạch chủ và card đồ họa hiệu năng cao.', NOW()),
(4, 'AMD', 'AMD là hãng công nghệ Mỹ nổi tiếng với bộ vi xử lý Ryzen và card đồ họa Radeon.', NOW()),
(5, 'NVIDIA', 'NVIDIA là tập đoàn công nghệ Mỹ dẫn đầu trong lĩnh vực GPU và AI computing.', NOW()),
(6, 'Asus', 'Thương hiệu công nghệ Đài Loan nổi tiếng với laptop, bo mạch chủ và card đồ họa.', NOW()),
(7, 'Gigabyte', 'Thương hiệu Đài Loan nổi tiếng với laptop gaming, bo mạch chủ và phần cứng máy tính.', NOW()),
(8, 'ASRock', 'Hãng sản xuất bo mạch chủ uy tín, nổi bật với thiết kế mạnh mẽ và độ bền cao.', NOW()),
(9, 'Logitech', 'Thương hiệu Thụy Sĩ chuyên sản xuất chuột, bàn phím, tai nghe và thiết bị ngoại vi.', NOW()),
(10, 'NZXT', 'Thương hiệu chuyên về case, tản nhiệt và phụ kiện PC cao cấp.', NOW()),
(11, 'Thermaltake', 'Cung cấp giải pháp tản nhiệt, vỏ case và nguồn máy tính hàng đầu.', NOW()),
(12, 'Intel', 'Tập đoàn công nghệ hàng đầu thế giới chuyên sản xuất CPU và chip xử lý.', NOW()),
(13, 'Corsair', 'Nhà sản xuất thiết bị ngoại vi, RAM, nguồn máy tính và tản nhiệt chất lượng cao.', NOW()),
(14, 'Cooler Master', 'Thương hiệu nổi tiếng về tản nhiệt, vỏ case và nguồn máy tính.', NOW()),
(15, 'Seagate', 'Công ty lưu trữ dữ liệu hàng đầu thế giới, nổi tiếng với HDD và SSD.', NOW()),
(16, 'Western Digital', 'Thương hiệu Mỹ chuyên sản xuất ổ cứng HDD và SSD hiệu suất cao.', NOW()),
(17, 'Kingston', 'Thương hiệu nổi tiếng toàn cầu về RAM, SSD và USB.', NOW()),
(18, 'G.Skill', 'Nhà sản xuất RAM hiệu năng cao, được ưa chuộng trong cộng đồng game thủ.', NOW()),
(19, 'ADATA', 'Công ty chuyên sản xuất RAM, SSD và phụ kiện lưu trữ.', NOW()),
(21, 'Razer', 'Công ty chuyên sản xuất gaming gear, laptop và phụ kiện chơi game cao cấp.', NOW()),
(22, 'SteelSeries', 'Hãng sản xuất thiết bị ngoại vi và phụ kiện chơi game hàng đầu thế giới.', NOW()),
(23, 'HyperX', 'Thương hiệu gaming gear và linh kiện hiệu năng cao thuộc Kingston.', NOW()),
(24, 'ASUS ROG', 'Dòng sản phẩm gaming cao cấp của ASUS, nổi bật với hiệu năng và thiết kế.', NOW()),
(25, 'PC build sẵn từ PCShop', 'PC build sẵn, đảm bảo hiệu năng vận hành giữa các linh kiện được chọn lọc.', NOW());


-- ===== PC BUILD SẴN =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('PC Gaming MSI Dragon X', 34990000, 5, 10, 'PC build sẵn hiệu năng cao, trang bị RTX 4070 và i7-13700K, RAM 32GB, SSD 1TB NVMe.', 24, 1, 1, 1, 25),
('PC Văn phòng FastWork i5', 12990000, 10, 15, 'PC văn phòng tiết kiệm điện, CPU i5-12400, RAM 16GB, SSD 512GB.', 24, 1, 0, 2, 25),
('Máy ảo DevServer Pro', 19990000, 8, 5, 'Máy ảo chuyên dụng cho lập trình và test server, CPU Ryzen 9 5900X, RAM 64GB.', 36, 1, 1, 3, 25);

-- ===== CPU =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('Intel Core i7-14700K', 10990000, 5, 25, 'CPU thế hệ 14 của Intel, 20 lõi, 28 luồng, hiệu năng vượt trội.', 36, 1, 1, 4, 12),
('AMD Ryzen 7 7800X3D', 9990000, 7, 20, 'CPU gaming mạnh mẽ với công nghệ 3D V-Cache.', 36, 1, 1, 4, 4);

-- ===== MAINBOARD =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('ASUS ROG STRIX B650E-F GAMING', 6690000, 5, 20, 'Bo mạch chủ cao cấp hỗ trợ CPU Ryzen 7000, DDR5.', 36, 1, 1, 5, 6),
('MSI Z790 TOMAHAWK WIFI', 8290000, 5, 10, 'Mainboard cao cấp cho Intel Gen 13-14.', 36, 1, 0, 5, 3);

-- ===== RAM =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 3990000, 10, 40, 'RAM DDR5 hiệu năng cao, tương thích mọi main DDR5.', 36, 1, 1, 6, 13),
('G.Skill Trident Z5 RGB 32GB (2x16GB) 6400MHz', 4290000, 5, 25, 'Thiết kế RGB cực đẹp, hiệu năng hàng đầu.', 36, 1, 1, 6, 18);

-- ===== GPU =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('NVIDIA RTX 4070 Ti SUPER', 21990000, 3, 12, 'Card đồ họa cao cấp, hiệu năng mạnh mẽ cho gaming và AI.', 36, 1, 1, 7, 5),
('Gigabyte RTX 4060 Eagle 8G', 10990000, 8, 15, 'Card đồ họa tầm trung, phù hợp gaming 2K.', 36, 1, 0, 7, 7);

-- ===== Ổ CỨNG =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('Kingston NV2 1TB NVMe Gen4', 1590000, 10, 60, 'SSD NVMe tốc độ cao cho mọi nhu cầu lưu trữ.', 36, 1, 0, 8, 17),
('Seagate Barracuda 2TB HDD', 1490000, 0, 80, 'Ổ cứng cơ lưu trữ bền bỉ, dung lượng lớn.', 24, 1, 0, 8, 15);

-- ===== PSU =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('Cooler Master MWE 650W Bronze', 1590000, 5, 40, 'Nguồn chuẩn 80 Plus Bronze, hiệu suất cao.', 36, 1, 0, 9, 14),
('Corsair RM750e 750W Gold', 2290000, 8, 30, 'Nguồn cao cấp chuẩn 80 Plus Gold, bảo vệ toàn diện.', 36, 1, 1, 9, 13);

-- ===== CASE =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('NZXT H510 Flow', 2190000, 10, 20, 'Case thiết kế tối giản, airflow tốt.', 36, 1, 0, 10, 10),
('Thermaltake Versa T27 TG', 1990000, 7, 18, 'Case gaming với mặt kính cường lực.', 36, 1, 0, 10, 11);

-- ===== MÀN HÌNH =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('ASUS TUF VG27AQ 27" 2K 165Hz', 7490000, 5, 15, 'Màn hình chơi game 2K tần số quét cao.', 36, 1, 1, 12, 6),
('Gigabyte M28U 28" 4K 144Hz', 9990000, 5, 10, 'Màn hình 4K, phù hợp gaming và đồ họa.', 36, 1, 1, 12, 7);

-- ===== PHỤ KIỆN =====
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, category_id, brand_id)
VALUES
('Logitech G Pro X Keyboard', 3290000, 8, 25, 'Bàn phím cơ chất lượng cao, switch hot-swap.', 24, 1, 1, 13, 9),
('Razer DeathAdder V3 Pro', 3890000, 10, 30, 'Chuột gaming siêu nhẹ, hiệu năng cao.', 24, 1, 1, 14, 21),
('HyperX Cloud Alpha S', 2890000, 7, 35, 'Tai nghe gaming âm thanh vòm 7.1.', 24, 1, 1, 15, 23);

INSERT INTO products (name, price, discount, stock_quantity, thumbnail, description, warranty_months, is_active, is_featured, created_at, updated_at, category_id, brand_id)
VALUES
('PC Gaming RTX 4070', 23336205, 10, 17, NULL, 'PC Gaming RTX 4070 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-08-27 07:37:33', '2025-10-29 07:37:33', 1, 25),
('PC Đồ họa Ryzen 7', 24333941, 15, 86, NULL, 'PC Đồ họa Ryzen 7 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-05-14 07:37:33', '2025-10-29 07:37:33', 1, 25),
('PC i7 13700K RTX 4070Ti', 18623805, 15, 47, NULL, 'PC i7 13700K RTX 4070Ti mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-07-24 07:37:33', '2025-10-29 07:37:33', 1, 25),
('PC chiến mọi game', 10533392, 5, 95, NULL, 'PC chiến mọi game mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-06-08 07:37:33', '2025-10-29 07:37:33', 1, 25),
('PC tối ưu đồ họa Adobe', 8570243, 0, 46, NULL, 'PC tối ưu đồ họa Adobe mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 0, '2025-07-25 07:37:33', '2025-10-29 07:37:33', 1, 25),
('PC Văn phòng Core i5', 30884287, 10, 13, NULL, 'PC Văn phòng Core i5 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-10-13 07:37:33', '2025-10-29 07:37:33', 2, 25),
('PC học tập giá rẻ', 21596716, 0, 55, NULL, 'PC học tập giá rẻ mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-09-05 07:37:33', '2025-10-29 07:37:33', 2, 25),
('PC Word Excel ổn định', 7824064, 5, 46, NULL, 'PC Word Excel ổn định mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-06-17 07:37:33', '2025-10-29 07:37:33', 2, 25),
('PC văn phòng mini', 29152716, 15, 34, NULL, 'PC văn phòng mini mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 0, '2025-05-11 07:37:33', '2025-10-29 07:37:33', 2, 25),
('PC cho sinh viên', 22042482, 5, 47, NULL, 'PC cho sinh viên mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-10-14 07:37:33', '2025-10-29 07:37:33', 2, 25),
('Server Mini Ryzen', 38284214, 15, 86, NULL, 'Server Mini Ryzen mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-09-25 07:37:33', '2025-10-29 07:37:33', 3, 25),
('Máy ảo chạy Linux', 4738307, 10, 82, NULL, 'Máy ảo chạy Linux mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-09-10 07:37:33', '2025-10-29 07:37:33', 3, 25),
('PC dựng lab ảo hóa', 16604743, 15, 76, NULL, 'PC dựng lab ảo hóa mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-07-06 07:37:33', '2025-10-29 07:37:33', 3, 25),
('PC Docker Kubernetes', 39602884, 0, 64, NULL, 'PC Docker Kubernetes mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-05-24 07:37:33', '2025-10-29 07:37:33', 3, 25),
('Máy chủ thử nghiệm', 13028030, 10, 38, NULL, 'Máy chủ thử nghiệm mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-10-06 07:37:33', '2025-10-29 07:37:33', 3, 25),
('Intel Core i9 14900K', 29226809, 10, 45, NULL, 'Intel Core i9 14900K mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-10-08 07:37:33', '2025-10-29 07:37:33', 4, 4),
('AMD Ryzen 9 7950X', 16003354, 10, 12, NULL, 'AMD Ryzen 9 7950X mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-08-10 07:37:33', '2025-10-29 07:37:33', 4, 12),
('Intel Core i5 12400F', 22848885, 0, 65, NULL, 'Intel Core i5 12400F mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-05-10 07:37:33', '2025-10-29 07:37:33', 4, 4),
('Ryzen 7 7800X3D', 36703973, 15, 32, NULL, 'Ryzen 7 7800X3D mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-07-08 07:37:33', '2025-10-29 07:37:33', 4, 12),
('Intel Core i7 13700KF', 17783033, 10, 99, NULL, 'Intel Core i7 13700KF mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-05-09 07:37:33', '2025-10-29 07:37:33', 4, 4),
('ASUS TUF B650', 37448689, 15, 81, NULL, 'ASUS TUF B650 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-08-18 07:37:33', '2025-10-29 07:37:33', 5, 8),
('Gigabyte Z790 Aorus', 29770812, 15, 100, NULL, 'Gigabyte Z790 Aorus mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 0, '2025-08-09 07:37:33', '2025-10-29 07:37:33', 5, 8),
('ASRock B550M Pro4', 31172907, 5, 16, NULL, 'ASRock B550M Pro4 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-07-20 07:37:33', '2025-10-29 07:37:33', 5, 7),
('MSI B760 Tomahawk', 12276394, 15, 67, NULL, 'MSI B760 Tomahawk mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-08-06 07:37:33', '2025-10-29 07:37:33', 5, 7),
('ASUS Prime Z790-P', 16244590, 10, 26, NULL, 'ASUS Prime Z790-P mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-07-14 07:37:33', '2025-10-29 07:37:33', 5, 6),
('Corsair Vengeance 16GB DDR5', 12671677, 5, 72, NULL, 'Corsair Vengeance 16GB DDR5 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-10-26 07:37:33', '2025-10-29 07:37:33', 6, 18),
('G.Skill Trident Z 32GB', 4238992, 10, 68, NULL, 'G.Skill Trident Z 32GB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-05-16 07:37:33', '2025-10-29 07:37:33', 6, 19),
('Kingston Fury 16GB DDR4', 19580576, 0, 36, NULL, 'Kingston Fury 16GB DDR4 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-09-22 07:37:33', '2025-10-29 07:37:33', 6, 18),
('ADATA XPG Lancer 32GB', 34681118, 5, 100, NULL, 'ADATA XPG Lancer 32GB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-07-23 07:37:33', '2025-10-29 07:37:33', 6, 18),
('G.Skill Ripjaws 8GB', 23460526, 10, 56, NULL, 'G.Skill Ripjaws 8GB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-10-12 07:37:33', '2025-10-29 07:37:33', 6, 17),
('NVIDIA RTX 4070', 37575253, 5, 64, NULL, 'NVIDIA RTX 4070 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-07-25 07:37:33', '2025-10-29 07:37:33', 7, 6),
('ASUS RTX 4080', 4759502, 15, 83, NULL, 'ASUS RTX 4080 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-06-03 07:37:33', '2025-10-29 07:37:33', 7, 7),
('Gigabyte RTX 4060Ti', 14415165, 10, 90, NULL, 'Gigabyte RTX 4060Ti mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-06-14 07:37:33', '2025-10-29 07:37:33', 7, 6),
('MSI RTX 4070 Super', 32473912, 15, 93, NULL, 'MSI RTX 4070 Super mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-05-19 07:37:33', '2025-10-29 07:37:33', 7, 5),
('NVIDIA RTX 4090', 31517948, 10, 56, NULL, 'NVIDIA RTX 4090 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-08-03 07:37:33', '2025-10-29 07:37:33', 7, 6),
('Seagate Barracuda 2TB', 28269722, 0, 55, NULL, 'Seagate Barracuda 2TB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-07-15 07:37:33', '2025-10-29 07:37:33', 8, 15),
('WD Blue 1TB SSD', 9347567, 5, 76, NULL, 'WD Blue 1TB SSD mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-07-15 07:37:33', '2025-10-29 07:37:33', 8, 15),
('Seagate FireCuda 520 1TB', 28435339, 10, 90, NULL, 'Seagate FireCuda 520 1TB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-05-08 07:37:33', '2025-10-29 07:37:33', 8, 16),
('WD Black SN850 2TB', 20568455, 5, 39, NULL, 'WD Black SN850 2TB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-08-15 07:37:33', '2025-10-29 07:37:33', 8, 15),
('Seagate IronWolf 4TB', 33147120, 15, 90, NULL, 'Seagate IronWolf 4TB mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-07-22 07:37:33', '2025-10-29 07:37:33', 8, 15),
('Cooler Master MWE 650W', 21659674, 15, 71, NULL, 'Cooler Master MWE 650W mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-08-23 07:37:33', '2025-10-29 07:37:33', 10, 10),
('NZXT C750 Bronze', 37719226, 15, 69, NULL, 'NZXT C750 Bronze mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-07-17 07:37:33', '2025-10-29 07:37:33', 10, 14),
('Thermaltake Smart 600W', 15096764, 15, 11, NULL, 'Thermaltake Smart 600W mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-10-12 07:37:33', '2025-10-29 07:37:33', 10, 14),
('Corsair RM850x', 25068257, 0, 67, NULL, 'Corsair RM850x mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-09-05 07:37:33', '2025-10-29 07:37:33', 10, 14),
('Cooler Master GX 550W', 10752755, 5, 100, NULL, 'Cooler Master GX 550W mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-06-27 07:37:33', '2025-10-29 07:37:33', 10, 10),
('Corsair iCUE 220T', 24323290, 5, 36, NULL, 'Corsair iCUE 220T mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-09-05 07:37:33', '2025-10-29 07:37:33', 11, 14),
('NZXT H510', 17160599, 15, 33, NULL, 'NZXT H510 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-05-22 07:37:33', '2025-10-29 07:37:33', 11, 13),
('Cooler Master MasterBox', 9633565, 5, 81, NULL, 'Cooler Master MasterBox mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-07-09 07:37:33', '2025-10-29 07:37:33', 11, 11),
('Thermaltake Versa H26', 36832270, 15, 82, NULL, 'Thermaltake Versa H26 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-06-08 07:37:33', '2025-10-29 07:37:33', 11, 13),
('ASUS Prime Case', 16574899, 0, 34, NULL, 'ASUS Prime Case mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-10-08 07:37:33', '2025-10-29 07:37:33', 11, 14),
('Cooler Master Hyper 212', 16062644, 10, 19, NULL, 'Cooler Master Hyper 212 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-09-30 07:37:33', '2025-10-29 07:37:33', 12, 14),
('NZXT Kraken 240', 7029692, 5, 24, NULL, 'NZXT Kraken 240 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-08-15 07:37:33', '2025-10-29 07:37:33', 12, 14),
('Thermaltake ToughAir', 29179310, 5, 75, NULL, 'Thermaltake ToughAir mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-06-15 07:37:33', '2025-10-29 07:37:33', 12, 10),
('Cooler Master ML240L', 17551750, 10, 78, NULL, 'Cooler Master ML240L mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-05-04 07:37:33', '2025-10-29 07:37:33', 12, 14),
('DeepCool AK400', 11186468, 0, 57, NULL, 'DeepCool AK400 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-07-02 07:37:33', '2025-10-29 07:37:33', 12, 10),
('ASUS ProArt 27 inch', 21500899, 10, 64, NULL, 'ASUS ProArt 27 inch mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-07-02 07:37:33', '2025-10-29 07:37:33', 13, 9),
('Gigabyte G27Q', 4828912, 10, 15, NULL, 'Gigabyte G27Q mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-05-10 07:37:33', '2025-10-29 07:37:33', 13, 3),
('MSI G32CQ5', 25662644, 15, 97, NULL, 'MSI G32CQ5 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-06-07 07:37:33', '2025-10-29 07:37:33', 13, 7),
('LG UltraGear 27', 17280572, 0, 13, NULL, 'LG UltraGear 27 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-09-11 07:37:33', '2025-10-29 07:37:33', 13, 3),
('AOC 24G2SPU', 22854964, 0, 73, NULL, 'AOC 24G2SPU mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-05-21 07:37:33', '2025-10-29 07:37:33', 13, 7),
('Logitech G213', 8152779, 5, 53, NULL, 'Logitech G213 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-08-11 07:37:33', '2025-10-29 07:37:33', 14, 9),
('Razer BlackWidow V3', 19738879, 0, 46, NULL, 'Razer BlackWidow V3 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu làm việc. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-08-02 07:37:33', '2025-10-29 07:37:33', 14, 9),
('SteelSeries Apex 3', 20808447, 15, 91, NULL, 'SteelSeries Apex 3 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-08-10 07:37:33', '2025-10-29 07:37:33', 14, 22),
('HyperX Alloy Core', 32596644, 10, 47, NULL, 'HyperX Alloy Core mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-08-19 07:37:33', '2025-10-29 07:37:33', 14, 22),
('ASUS TUF K3', 18047328, 5, 57, NULL, 'ASUS TUF K3 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-10-22 07:37:33', '2025-10-29 07:37:33', 14, 21),
('Logitech G502', 4137361, 0, 51, NULL, 'Logitech G502 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-07-20 07:37:33', '2025-10-29 07:37:33', 15, 22),
('Razer Basilisk V3', 12654109, 5, 31, NULL, 'Razer Basilisk V3 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-10-20 07:37:33', '2025-10-29 07:37:33', 15, 21),
('SteelSeries Rival 5', 30582335, 0, 50, NULL, 'SteelSeries Rival 5 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-05-03 07:37:33', '2025-10-29 07:37:33', 15, 21),
('HyperX Pulsefire', 20756801, 15, 63, NULL, 'HyperX Pulsefire mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-08-30 07:37:33', '2025-10-29 07:37:33', 15, 9),
('ASUS ROG Gladius', 9436696, 0, 19, NULL, 'ASUS ROG Gladius mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-08-11 07:37:33', '2025-10-29 07:37:33', 15, 22),
('HyperX Cloud II', 12062868, 15, 75, NULL, 'HyperX Cloud II mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-09-03 07:37:33', '2025-10-29 07:37:33', 16, 23),
('Razer Kraken X', 10847086, 10, 26, NULL, 'Razer Kraken X mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 0, '2025-06-04 07:37:33', '2025-10-29 07:37:33', 16, 22),
('SteelSeries Arctis 5', 26017055, 15, 76, NULL, 'SteelSeries Arctis 5 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu đồ họa. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 0, '2025-09-27 07:37:33', '2025-10-29 07:37:33', 16, 23),
('Logitech G Pro X', 31067020, 15, 74, NULL, 'Logitech G Pro X mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-05-21 07:37:33', '2025-10-29 07:37:33', 16, 23),
('ASUS TUF H3', 7276682, 0, 29, NULL, 'ASUS TUF H3 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-08-16 07:37:33', '2025-10-29 07:37:33', 16, 22),
('Logitech Z407', 34189680, 15, 37, NULL, 'Logitech Z407 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 12 tháng.', 12, 1, 1, '2025-09-01 07:37:33', '2025-10-29 07:37:33', 17, 23),
('Razer Nommo Chroma', 10497248, 0, 88, NULL, 'Razer Nommo Chroma mang đến hiệu năng vượt trội, phù hợp cho nhu cầu ảo hóa. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 1, '2025-08-10 07:37:33', '2025-10-29 07:37:33', 17, 23),
('SteelSeries Arena 3', 10096616, 5, 100, NULL, 'SteelSeries Arena 3 mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 1, '2025-10-07 07:37:33', '2025-10-29 07:37:33', 17, 22),
('HyperX DuoCast', 37197364, 0, 49, NULL, 'HyperX DuoCast mang đến hiệu năng vượt trội, phù hợp cho nhu cầu văn phòng. Sản phẩm chính hãng, bảo hành 36 tháng.', 36, 1, 0, '2025-10-29 07:37:33', '2025-10-29 07:37:33', 17, 23),
('ASUS ROG Strix Go', 18284081, 10, 72, NULL, 'ASUS ROG Strix Go mang đến hiệu năng vượt trội, phù hợp cho nhu cầu chơi game. Sản phẩm chính hãng, bảo hành 24 tháng.', 24, 1, 0, '2025-10-17 07:37:33', '2025-10-29 07:37:33', 17, 22);
INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, created_at, updated_at, category_id, brand_id)
VALUES
('PC Gaming Ultimate RTX 4080 Super', 53990000, 5, 5, 'Cấu hình siêu khủng dành cho game thủ chuyên nghiệp và streamer. Trang bị CPU Ryzen 9 7900X, GPU RTX 4080 Super, RAM DDR5 64GB, SSD NVMe 2TB, tản nhiệt nước 360mm. Hỗ trợ chơi mượt ở độ phân giải 4K, đồng thời xử lý video 8K nhanh chóng.', 36, 1, 1, NOW(), NOW(), 1, 25),

('PC Văn phòng All-in-One i5 Gen13', 12490000, 0, 20, 'Máy tính tất cả trong một với thiết kế tinh gọn, CPU i5-13400, RAM 16GB, SSD 512GB. Màn hình IPS Full HD 24 inch tích hợp sẵn, phù hợp cho nhân viên văn phòng, học sinh hoặc hộ gia đình.', 18, 1, 0, NOW(), NOW(), 2, 25),

('PC Máy ảo Intel Xeon Silver 4310', 37990000, 10, 3, 'Server mini hỗ trợ ảo hóa VMware, Proxmox, hoặc Docker. Trang bị CPU Xeon Silver 4310 (12 nhân), RAM 128GB ECC, SSD 2TB NVMe. Hỗ trợ chạy nhiều máy ảo song song, phù hợp phòng lab hoặc DevOps.', 36, 1, 1, NOW(), NOW(), 3, 25),

('PC Gaming Compact RTX 4060Ti', 22490000, 0, 12, 'PC chơi game hiệu năng cao với kích thước nhỏ gọn. CPU Intel i5-13500, GPU RTX 4060Ti, RAM 16GB DDR5, SSD 1TB Gen4. Thiết kế case mini tower, tản nhiệt hiệu quả, tối ưu không gian.', 24, 1, 0, NOW(), NOW(), 1, 25),

('CPU Intel Core i9-14900KF', 16990000, 0, 15, 'CPU cao cấp nhất của Intel thế hệ 14, với 24 nhân và 32 luồng, turbo boost lên đến 6GHz. Dành cho người dùng chuyên nghiệp cần hiệu năng mạnh mẽ để chơi game, dựng video hoặc render.', 36, 1, 1, NOW(), NOW(), 4, 4),

('CPU AMD Ryzen 7 7800X3D', 11990000, 0, 18, 'CPU được đánh giá là tốt nhất cho gaming nhờ công nghệ 3D V-Cache của AMD. 8 nhân 16 luồng, xung nhịp cao, tương thích mainboard AM5. Rất lý tưởng cho gamer và streamer.', 36, 1, 1, NOW(), NOW(), 4, 12),

('Mainboard ASUS TUF B650-PLUS WIFI', 5990000, 0, 25, 'Bo mạch chủ bền bỉ dành cho CPU Ryzen, hỗ trợ RAM DDR5, PCIe 5.0, Wi-Fi 6, USB-C. Thiết kế tản nhiệt kim loại, phù hợp cho dàn PC gaming tầm trung và cao.', 24, 1, 0, NOW(), NOW(), 5, 7),

('Mainboard MSI PRO Z790-A DDR5', 7190000, 5, 14, 'Mainboard Z790 hỗ trợ CPU Intel thế hệ 13/14, RAM DDR5, 4 khe M.2 Gen4. Cổng LAN 2.5G, USB-C 20Gbps, BIOS thân thiện. Dành cho người dùng cao cấp.', 24, 1, 1, NOW(), NOW(), 5, 6),

('RAM G.Skill Trident Z5 RGB DDR5 32GB 6000MHz', 3590000, 0, 30, 'RAM DDR5 hiệu năng cao với thiết kế RGB đẹp mắt, tốc độ 6000MHz. Tương thích Intel và AMD, rất phù hợp cho gaming và xử lý đồ họa nặng.', 24, 1, 0, NOW(), NOW(), 6, 18),

('RAM Corsair Vengeance DDR5 32GB 5600MHz', 2990000, 0, 25, 'RAM DDR5 đến từ thương hiệu nổi tiếng Corsair, hỗ trợ XMP 3.0, tản nhiệt nhôm đen mạnh mẽ. Độ ổn định cao, thích hợp cho dân đồ họa và kỹ sư phần mềm.', 24, 1, 0, NOW(), NOW(), 6, 19),

('GPU MSI RTX 4070 VENTUS 2X 12G OC', 17990000, 5, 10, 'Card đồ họa hiệu năng cao từ MSI, chạy mát và êm. RTX 4070 với 12GB VRAM GDDR6X, hỗ trợ DLSS 3, Ray Tracing, phù hợp cho game và render 3D.', 24, 1, 1, NOW(), NOW(), 7, 6),

('GPU ASUS Dual RTX 4060Ti 8G OC', 13990000, 0, 12, 'GPU mạnh mẽ cho gaming và đồ họa. Sử dụng chip RTX 4060Ti, hiệu năng vượt trội ở độ phân giải 2K. Hệ thống tản nhiệt kép giảm tiếng ồn tối đa.', 24, 1, 0, NOW(), NOW(), 7, 7),

('CPU Intel Core i7-14700KF', 10490000, 0, 18, 'CPU Intel i7-14700KF thế hệ 14, gồm 20 nhân 28 luồng, turbo boost đến 5.6GHz. Phù hợp cho người dùng cao cấp, coder, designer hoặc streamer.', 36, 1, 1, NOW(), NOW(), 4, 4),

('CPU AMD Ryzen 5 7600X', 7190000, 0, 20, 'Bộ xử lý tầm trung xuất sắc, 6 nhân 12 luồng, xung nhịp cao, tiêu thụ điện thấp. Phù hợp cho gaming và công việc đồ họa nhẹ.', 36, 1, 0, NOW(), NOW(), 4, 12),

('Mainboard Gigabyte B760M DS3H AX DDR4', 3490000, 0, 25, 'Mainboard hỗ trợ CPU Intel thế hệ 12/13, có Wi-Fi AX và Bluetooth 5.2. Thiết kế micro-ATX nhỏ gọn, phù hợp cho các dàn PC văn phòng hoặc gaming tầm trung.', 24, 1, 0, NOW(), NOW(), 5, 8),

('Mainboard ASUS PRIME Z790-P WIFI', 6590000, 0, 15, 'Bo mạch chủ cao cấp, hỗ trợ RAM DDR5, PCIe 5.0, Wi-Fi 6E, USB 20Gbps. Thiết kế trắng tinh tế, được ưa chuộng trong các build PC hiện đại.', 24, 1, 1, NOW(), NOW(), 5, 7),

('RAM Kingston Fury Beast DDR5 32GB 6000MHz', 3090000, 0, 22, 'RAM DDR5 đến từ Kingston, hiệu năng ổn định, tương thích nhiều bo mạch. Tốc độ 6000MHz, giúp hệ thống phản hồi nhanh hơn trong xử lý đồ họa và game.', 24, 1, 0, NOW(), NOW(), 6, 17),

('GPU Gigabyte RTX 4060 EAGLE 8G', 11990000, 0, 20, 'Card đồ họa RTX 4060 hiệu năng ổn định, hỗ trợ DLSS 3.0, tiêu thụ điện thấp, hoạt động êm ái. Phù hợp chơi các tựa game eSports và AAA phổ biến.', 24, 1, 0, NOW(), NOW(), 7, 8),

('RAM Corsair Vengeance DDR4 16GB 3200MHz', 1390000, 0, 35, 'RAM DDR4 phổ biến, giá tốt, hiệu năng ổn định. Tốc độ 3200MHz, tản nhiệt nhôm cao cấp, tương thích mọi bo mạch chủ phổ thông.', 24, 1, 0, NOW(), NOW(), 6, 19),

('GPU ASUS TUF RTX 4080 16GB GDDR6X', 33990000, 5, 5, 'Card đồ họa flagship từ ASUS, dùng GPU RTX 4080, hiệu suất vượt trội trong chơi game 4K và render nặng. Trang bị tản nhiệt 3 quạt, vỏ kim loại cực bền.', 36, 1, 1, NOW(), NOW(), 7, 7),

('PC Gaming Ryzen 5 7600 + RTX 4070', 28990000, 0, 9, 'Cấu hình cực kỳ cân bằng giữa giá và hiệu năng: Ryzen 5 7600, RTX 4070, RAM DDR5 32GB, SSD 1TB Gen4. Chạy mượt mọi game 2K, thích hợp cho cả stream và render.', 24, 1, 1, NOW(), NOW(), 1, 25),

('PC Làm việc học tập Intel i3 + 16GB RAM', 9490000, 0, 20, 'Máy tính văn phòng học tập nhỏ gọn, CPU i3-13100, RAM 16GB, SSD 512GB, hoạt động mượt với các ứng dụng văn phòng, Zoom, Google Meet và trình duyệt.', 18, 1, 0, NOW(), NOW(), 2, 25),

('PC Gaming Streamer Edition i5 + RTX 3060', 19990000, 10, 7, 'Máy chuyên stream và gaming, trang bị i5-12400F, GPU RTX 3060 12GB, RAM 16GB, SSD 1TB. Case RGB sang trọng, hiệu năng cao trong tầm giá.', 24, 1, 1, NOW(), NOW(), 1, 25),

('PC Máy ảo DevOps Server Ryzen 9', 29990000, 0, 5, 'Cấu hình server nhỏ gọn với Ryzen 9 5950X, RAM 64GB, SSD NVMe 2TB. Hỗ trợ Docker, Kubernetes và nhiều VM song song, lý tưởng cho lập trình viên backend và học viên DevOps.', 36, 1, 1, NOW(), NOW(), 3, 25),

('CPU Intel Core i5-14400', 5990000, 0, 25, 'CPU Intel Core i5 thế hệ 14 với 10 nhân, 16 luồng, xung nhịp tối đa 4.7GHz. Dành cho người dùng phổ thông cần hiệu năng cao cho văn phòng và game.', 24, 1, 0, NOW(), NOW(), 4, 4),

('CPU AMD Ryzen 9 7950X3D', 17990000, 0, 12, 'CPU mạnh nhất của AMD với 16 nhân 32 luồng và công nghệ 3D V-Cache. Tối ưu hiệu năng gaming và xử lý đồ họa chuyên nghiệp, hiệu quả vượt trội.', 36, 1, 1, NOW(), NOW(), 4, 12);

INSERT INTO products (name, price, discount, stock_quantity, description, warranty_months, is_active, is_featured, created_at, updated_at, category_id, brand_id)
VALUES
-- 1
('PC Gaming SilentCore i9-13900K + RTX 4080', 48990000, 5, 8,
 'Dàn PC hiệu năng cao tối ưu cho làm việc và chơi game: i9-13900K, RTX 4080, RAM 32GB DDR5, SSD NVMe 2TB. Thiết kế tản nhiệt tốt, hoạt động êm, phù hợp stream và dựng video.', 36, 1, 1, NOW(), NOW(), 1, 25),

-- 2
('PC Văn phòng Compact Ryzen 5 7600G', 10490000, 0, 20,
 'Máy văn phòng nhỏ gọn trang bị Ryzen 5 7600G với GPU tích hợp, RAM 16GB và SSD 512GB. Khởi động nhanh, chạy đa tab trình duyệt và các ứng dụng văn phòng mượt.', 24, 1, 0, NOW(), NOW(), 2, 25),

-- 3
('PC Máy ảo MicroServer Xeon E-2388G 128GB', 35990000, 10, 4,
 'Máy ảo chuyên nghiệp cho dev/test, Xeon E-2388G 8 nhân, RAM ECC 128GB, SSD NVMe 1TB, hỗ trợ ảo hoá nhiều máy ảo nhẹ-mạnh. Thiết kế tiêu thụ điện hợp lý.', 36, 1, 1, NOW(), NOW(), 3, 25),

-- 4
('Intel Core i7-13700F (16 nhân, 24 luồng)', 9490000, 5, 50,
 'CPU i7-13700F thế hệ 13, hiệu năng mạnh cho game và làm việc đa nhiệm. Hỗ trợ DDR5/DDR4 tùy main, tối ưu cho build hiệu năng cao với tản khí tốt.', 36, 1, 1, NOW(), NOW(), 4, 12),

-- 5
('AMD Ryzen 5 5600X (6 nhân 12 luồng)', 3790000, 0, 80,
 'Ryzen 5 5600X mang lại hiệu năng/giá rất tốt cho game và ứng dụng phổ thông, tiêu thụ điện thấp và tương thích nhiều main AM4.', 36, 1, 0, NOW(), NOW(), 4, 4),

-- 6
('ASUS ROG STRIX B760-F GAMING WIFI', 6590000, 5, 22,
 'Mainboard ROG STRIX hỗ trợ Intel Gen13/14, DDR5, WiFi 6E, nhiều khe M.2 và tản VRM cao cấp cho ép xung ổn định.', 36, 1, 1, NOW(), NOW(), 5, 6),

-- 7
('MSI MAG B650 TOMAHAWK', 4990000, 0, 40,
 'Mainboard AM5 tầm trung tốt cho gaming: hỗ trợ DDR5, PCIe 5.0 cho SSD, chất lượng linh kiện cao và BIOS dễ tùy chỉnh.', 36, 1, 0, NOW(), NOW(), 5, 3),

-- 8
('G.Skill Trident Z5 16GB (2x8GB) 7200MHz', 1890000, 0, 60,
 'RAM DDR5 tốc độ cao 7200MHz, hiệu năng top cho game thủ và creator. Thiết kế tản nhiệt nhôm, tương thích nhiều main hiện đại.', 36, 1, 1, NOW(), NOW(), 6, 18),

-- 9
('Corsair Vengeance DDR4 32GB (2x16GB) 3200MHz', 1790000, 5, 45,
 'Bộ nhớ DDR4 dung lượng 32GB, phù hợp cho multitasking, dựng video và chạy VM nhẹ. Thương hiệu Corsair uy tín, bảo hành tốt.', 36, 1, 0, NOW(), NOW(), 6, 13),

-- 10
('MSI RTX 4070 Ti Gaming Trio 16GB', 21990000, 5, 18,
 'GPU cao cấp MSI với tản nhiệt mạnh mẽ, hiệu năng ổn định cho game 2K/4K và tác vụ dựng phim. Hỗ trợ DLSS, Ray Tracing và các API hiện đại.', 36, 1, 1, NOW(), NOW(), 7, 3),

-- 11
('PC Gaming ProStream i9-14900K + RTX 4090', 89990000, 5, 3,
 'Dàn máy tối thượng cho stream/professional: i9-14900K, RTX 4090, RAM 64GB DDR5, SSD 2TB NVMe, hệ thống tản nước 360mm, nguồn 1000W 80+ Platinum.', 36, 1, 1, NOW(), NOW(), 1, 25),

-- 12
('PC Văn phòng Allround Ryzen 5 5500', 9290000, 0, 28,
 'PC văn phòng hiệu quả với Ryzen 5 5500, RAM 16GB, SSD 512GB. Hoạt động mát, phù hợp phục vụ bộ phận kế toán, hành chính và học tập.', 24, 1, 0, NOW(), NOW(), 2, 25),

-- 13
('PC Máy ảo RackMount Dual Xeon 24C', 55990000, 8, 2,
 'Server rackmount cho ảo hóa với 2x Xeon 12 core, RAM ECC 192GB, ổ NVMe RAID, phù hợp cho doanh nghiệp nhỏ triển khai môi trường ảo hoá.', 36, 1, 0, NOW(), NOW(), 3, 25),

-- 14
('Intel Core i5-13600K (14 nhân, 20 luồng)', 7490000, 5, 60,
 'CPU phổ biến cho game và công việc, kết hợp nhân hiệu năng và nhân tiết kiệm, xung cao khi cần, hỗ trợ ép xung ổn định.', 36, 1, 1, NOW(), NOW(), 4, 12),

-- 15
('AMD Ryzen 3 5300G (4 nhân 8 luồng)', 1990000, 0, 90,
 'APU giá rẻ phù hợp văn phòng và học tập, tích hợp đồ họa tốt cho các nhu cầu nhẹ, tiết kiệm chi phí nâng cấp GPU.', 24, 1, 0, NOW(), NOW(), 4, 4),

-- 16
('ASRock Z790 EXTREME WiFi', 7390000, 5, 10,
 'Mainboard Z790 hiệu năng cao, trang bị WiFi 6E, nhiều khe M.2, PCB dày, tản nhiệt VRM lớn cho người dùng ép xung.', 36, 1, 1, NOW(), NOW(), 5, 8),

-- 17
('Gigabyte B650 AORUS ELITE AX', 4590000, 0, 35,
 'Mainboard AM5 hỗ trợ DDR5, WiFi tích hợp, cổng I/O đa dạng. Lựa chọn đáng giá cho các cấu hình Ryzen 7000 tầm trung.', 36, 1, 0, NOW(), NOW(), 5, 7),

-- 18
('Kingston Fury Renegade DDR5 32GB 6400MHz', 3390000, 0, 20,
 'RAM hiệu năng cao cho gaming và content creation, tản nhiệt tốt và độ ổn định khi ép xung.', 36, 1, 1, NOW(), NOW(), 6, 17),

-- 19
('Corsair Dominator Platinum RGB 64GB (2x32GB) 5200MHz', 8990000, 5, 8,
 'RAM cho workstation cao cấp, dung lượng lớn, RGB, hiệu suất ổn định cho render và xử lý dữ liệu nặng.', 36, 1, 1, NOW(), NOW(), 6, 13),

-- 20
('ASUS TUF Gaming RTX 4060 8GB', 10990000, 0, 50,
 'Card đồ họa tầm trung từ ASUS, tối ưu cho game 1080p/2K, hoạt động ổn định và mát, phù hợp build phổ thông.', 24, 1, 0, NOW(), NOW(), 7, 6),

-- 21
('PC Gaming Entry-Level Ryzen 5 4500 + GTX 1650', 12990000, 0, 12,
 'Bộ PC entry-level dành cho sinh viên: Ryzen 5 4500, GTX 1650, RAM 16GB, SSD 512GB. Chơi được game eSports mượt và học tập hiệu quả.', 18, 1, 0, NOW(), NOW(), 1, 25),

-- 22
('PC Văn phòng SSD FastBoot i3', 7490000, 0, 35,
 'Máy văn phòng trang bị SSD NVMe giúp khởi động và làm việc nhanh, CPU i3 thế hệ mới, RAM 8-16GB, tiết kiệm điện.', 12, 1, 0, NOW(), NOW(), 2, 25),

-- 23
('PC Máy ảo HomeLab Ryzen 7 5800X', 21990000, 5, 6,
 'Máy ảo cho lab cá nhân: Ryzen 7 5800X 8 nhân, RAM 64GB, SSD NVMe 1TB, thích hợp cho học Docker, Kubernetes và lab ảo hóa nhỏ.', 36, 1, 1, NOW(), NOW(), 3, 25),

-- 24
('Intel Core i3-12100F (4 nhân 8 luồng)', 1990000, 0, 120,
 'CPU giá rẻ hiệu năng ổn định cho các bộ PC văn phòng và học tập. Tương thích nhiều main LGA1700, dễ dàng nâng cấp.', 24, 1, 0, NOW(), NOW(), 4, 12),

-- 25
('AMD Ryzen 7 7700X (8 nhân 16 luồng)', 7390000, 0, 30,
 'CPU Ryzen 7000 series cân bằng tốt giữa đa nhân và IPC, rất phù hợp cho cả gaming và tác vụ sáng tạo nội dung.', 36, 1, 1, NOW(), NOW(), 4, 4),

-- 26
('MSI PRO Z690-A DDR4', 4590000, 0, 50,
 'Mainboard Z690 hỗ trợ CPU Intel Gen12 với DDR4, phù hợp cho người muốn tận dụng RAM cũ nhưng cần nền tảng mạnh mẽ.', 24, 1, 0, NOW(), NOW(), 5, 3),

-- 27
('ASUS PRIME B660M-A D4', 2590000, 0, 60,
 'Mainboard tầm trung cho Intel Gen12, thiết kế bền bỉ, nhiều cổng mở rộng, phù hợp build văn phòng và gaming nhẹ.', 24, 1, 0, NOW(), NOW(), 5, 6),

-- 28
('G.Skill Aegis DDR5 16GB 5200MHz', 1090000, 0, 70,
 'RAM DDR5 giá hợp lý cho các build cơ bản, hiệu năng tốt cho game và ứng dụng chung.', 24, 1, 0, NOW(), NOW(), 6, 18),

-- 29
('Corsair Vengeance LPX DDR4 16GB 3200MHz', 690000, 0, 120,
 'RAM DDR4 phổ thông, giá tốt, tương thích rộng rãi, lựa chọn ổn cho build văn phòng và học tập.', 24, 1, 0, NOW(), NOW(), 6, 13),

-- 30
('GIGABYTE AORUS RTX 4070 MASTER 12GB', 19990000, 5, 14,
 'GPU AORUS series mạnh mẽ, thiết kế tản nhiệt cao cấp, tối ưu cho game 2K và làm đồ họa chuyên nghiệp.', 36, 1, 1, NOW(), NOW(), 7, 7),

-- 31
('PC Gaming Workstation RTX 4070 + 64GB RAM', 42990000, 5, 6,
 'PC kết hợp cho game và công việc nặng: RTX 4070, CPU Ryzen 9 7900X, RAM 64GB, SSD 2TB — phù hợp streamer và editor video bán chuyên.', 36, 1, 1, NOW(), NOW(), 1, 25),

-- 32
('PC Văn phòng ThinClient i5-12400', 8990000, 0, 25,
 'Máy văn phòng hiệu suất ổn định, i5-12400, RAM 8GB, SSD 512GB, thiết kế mỏng tiết kiệm diện tích, dễ bảo trì.', 12, 1, 0, NOW(), NOW(), 2, 25),

-- 33
('PC Máy ảo Entry Xeon E-2224G 32GB', 13990000, 0, 10,
 'Máy ảo cơ bản cho test và demo: Xeon E-2224G, RAM 32GB ECC, SSD 1TB. Phù hợp cho dev nhỏ cần môi trường ảo.', 24, 1, 0, NOW(), NOW(), 3, 25),

-- 34
('Intel Core i9-13900KS (24 nhân)", 15990000, 5, 10,
 'Phiên bản KS của i9-13900K tối ưu cho xung cao liên tục, phù hợp enthusiast và người dựng content nặng.', 36, 1, 1, NOW(), NOW(), 4, 12),

-- 35
('AMD Ryzen 5 7600 (6 nhân 12 luồng)', 4290000, 0, 40,
 'Ryzen 5 7600 cân bằng cho gaming và đồ họa nhẹ, hiệu năng ổn định trên nền AM5 với khả năng nâng cấp tốt.', 36, 1, 0, NOW(), NOW(), 4, 4),

-- 36
('ASUS ROG MAXIMUS Z790 HERO', 12490000, 5, 6,
 'Mainboard cao cấp dành cho ép xung và gaming pro, nhiều tính năng cao cấp như PCIe 5.0, Ethernet 10Gb và hệ thống tản nhiệt mạnh.', 36, 1, 1, NOW(), NOW(), 5, 6),

-- 37
('MSI MAG B660M Mortar', 2990000, 0, 45,
 'Mainboard micro-ATX với VRM tốt cho build tầm trung, hỗ trợ M.2 và nhiều cổng USB, phù hợp cho người dùng không cần full-size.', 24, 1, 0, NOW(), NOW(), 5, 3),

-- 38
('Kingston KF552 8GB DDR5 5200MHz', 450000, 0, 200,
 'Module RAM 8GB DDR5 giá rẻ cho nâng cấp từng thanh, phù hợp cho đa số main DDR5 phổ thông.', 24, 1, 0, NOW(), NOW(), 6, 17),

-- 39
('Corsair Vengeance RGB PRO DDR5 32GB 5600MHz', 3190000, 5, 28,
 'RAM DDR5 có RGB cho dàn máy đẹp mắt và hiệu năng cao, tối ưu cho gaming và livestream.', 36, 1, 1, NOW(), NOW(), 6, 13),

-- 40
('NVIDIA RTX 4060 SUPER Founders 8GB', 12990000, 0, 22,
 'GPU tầm trung cao cho 1080p/1440p, hiệu năng tốt, tiêu thụ điện hợp lý và hỗ trợ các công nghệ DLSS.', 24, 1, 0, NOW(), NOW(), 7, 5),

-- 41
('PC Gaming Compact Ryzen 7 7700 + RTX 4060', 27990000, 5, 12,
 'PC nhỏ gọn hiệu năng cao: Ryzen 7 7700, RTX 4060, RAM 32GB DDR5, SSD 1TB — phù hợp người cần hiệu năng nhưng hạn chế diện tích.', 24, 1, 1, NOW(), NOW(), 1, 25),

-- 42
('PC Văn phòng Secure i5-13400 + TPM', 11990000, 0, 20,
 'Máy văn phòng tích hợp TPM cho bảo mật doanh nghiệp, i5-13400, RAM 16GB, SSD 512GB, phù hợp môi trường làm việc yêu cầu cao về bảo mật.', 24, 1, 0, NOW(), NOW(), 2, 25),

-- 43
('PC Máy ảo HighMem Ryzen Threadripper PRO', 75990000, 0, 2,
 'Workstation/Server cho xử lý dữ liệu lớn: Threadripper PRO, RAM 256GB, SSD 2TB NVMe, hỗ trợ ảo hóa và xử lý AI quy mô nhỏ.', 36, 1, 1, NOW(), NOW(), 3, 25),

-- 44
('Intel Pentium Gold G7400 (2 nhân)', 950000, 0, 150,
 'CPU siêu rẻ cho máy văn phòng cơ bản, dùng cho hộ gia đình, quầy bán hàng hoặc học tập trực tuyến.', 12, 1, 0, NOW(), NOW(), 4, 12),

-- 45
('AMD Athlon 3000G (2 nhân, tích hợp GPU)', 750000, 0, 80,
 'APU giá rẻ cho nhu cầu rất cơ bản: lướt web, văn phòng nhẹ, xem video HD. Tiết kiệm chi phí cho build cơ bản.', 12, 1, 0, NOW(), NOW(), 4, 4),

-- 46
('ASUS B660 TUF GAMING WIFI', 3290000, 0, 50,
 'Mainboard TUF cho Intel Gen12–13, trang bị WiFi, tản nhiệt VRM, phù hợp build bền bỉ và ổn định.', 24, 1, 0, NOW(), NOW(), 5, 6),

-- 47
('Gigabyte Z690 AORUS PRO AX', 6590000, 0, 18,
 'Mainboard Z690 cao cấp, nhiều khe M.2, LAN 2.5G và WiFi tích hợp, phù hợp cho dàn máy chơi game và workstation.', 36, 1, 1, NOW(), NOW(), 5, 7),

-- 48
('G.Skill Ripjaws V DDR4 16GB 3600MHz', 750000, 0, 80,
 'RAM DDR4 hiệu năng ổn định, phù hợp cho game và ứng dụng hàng ngày, dễ lắp đặt và tương thích rộng.', 24, 1, 0, NOW(), NOW(), 6, 18),

-- 49
('Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz', 1790000, 0, 35,
 'Bộ RAM DDR4 dung lượng lớn cho multitasking, render nhẹ và chạy VM nhỏ. Độ ổn định tốt từ Corsair.', 36, 1, 0, NOW(), NOW(), 6, 13),

-- 50
('MSI RTX 4060 GAMING X 8G', 11490000, 0, 25,
 'GPU MSI tầm trung, thiết kế tốt, hiệu năng ổn định cho game 1080p cao và 1440p trung bình.', 24, 1, 0, NOW(), NOW(), 7, 3),

-- 51
('PC Gaming StreamMax Ryzen 9 + RTX 4070', 39990000, 5, 7,
 'Dàn máy cho streamer chuyên nghiệp: Ryzen 9 7900X, RTX 4070, RAM 32GB, SSD 1TB. Hệ thông tản nhiệt quality và case tối ưu luồng gió.', 36, 1, 1, NOW(), NOW(), 1, 25),

-- 52
('PC Văn phòng Allset i7-12700 + 32GB RAM', 16990000, 0, 10,
 'Máy văn phòng hiệu năng cao cho designer nhẹ và multitask: i7-12700, RAM 32GB, SSD 1TB, hoạt động ổn định cho nhiều ứng dụng cùng lúc.', 24, 1, 0, NOW(), NOW(), 2, 25),

-- 53
('PC Máy ảo TinyHome Ryzen 5 + 64GB RAM', 17990000, 0, 12,
 'Máy ảo nhỏ gọn cho môi trường học, phát triển: Ryzen 5 5600, RAM 64GB, SSD 1TB NVMe, phù hợp sinh viên DevOps và học lập trình.', 36, 1, 0, NOW(), NOW(), 3, 25),

-- 54
('Intel Core i7-12700 (12 nhân, 20 luồng)', 8490000, 0, 35,
 'CPU cân bằng dành cho người dùng muốn hiệu năng đa nhiệm tốt, hỗ trợ nhiều ứng dụng nặng và chạy VM nhẹ.', 36, 1, 0, NOW(), NOW(), 4, 12),

-- 55
('AMD Ryzen Threadripper 2950X (16 nhân)', 14990000, 0, 2,
 'CPU HEDT dành cho workstation render và xử lý dữ liệu lớn, nhiều luồng xử lý cho tác vụ chuyên sâu.', 36, 1, 1, NOW(), NOW(), 4, 4),

-- 56
('ASUS PRIME X670-P WIFI', 4990000, 0, 28,
 'Mainboard X670 cho AMD AM5, hỗ trợ DDR5, PCIe 5.0 và nhiều cổng lưu trữ, phù hợp build Ryzen 7000.', 36, 1, 0, NOW(), NOW(), 5, 6),

-- 57
('MSI MPG Z790 CARBON WIFI', 8990000, 5, 9,
 'Mainboard Z790 cao cấp, phong cách carbon, có WiFi 6E, nhiều khe M.2 và tản nhiệt premium, phù hợp chơi game và làm việc nặng.', 36, 1, 1, NOW(), NOW(), 5, 3),

-- 58
('Kingston Canvas React Plus 1TB NVMe (SSD) - placeholder for RAM category reason', 1290000, 0, 60,
 'Mô tả: SSD NVMe 1TB tốc độ cao, phù hợp lưu trữ game và project. (Ghi chú: sản phẩm này để bổ sung kho ổ cứng/ram thay thế nếu cần.)', 36, 1, 0, NOW(), NOW(), 6, 17),

-- 59
('Corsair Vengeance DDR5 16GB 5200MHz', 1490000, 0, 75,
 'Thanh RAM DDR5 dung lượng 16GB, tốc độ 5200MHz, tối ưu cho build mới, tương thích mượt với các bo mạch DDR5.', 24, 1, 0, NOW(), NOW(), 6, 13),

-- 60
('GIGABYTE RTX 4070 Ti Gaming OC 12GB', 21990000, 5, 11,
 'GPU Gigabyte hiệu năng cao, thiết kế tản nhiệt mạnh mẽ, phù hợp cho game 2K/4K và xử lý đồ họa nặng, có tinh chỉnh xung sẵn cho hiệu năng cao hơn.', 36, 1, 1, NOW(), NOW(), 7, 7;
