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