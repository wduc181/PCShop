## 1. Chuẩn bị môi trường

### Backend
- **JDK 24+**
- **MySQL**
- **Maven**

### Frontend
- **Node.js 18+**
- Dùng **npm** hoặc **yarn**

---

## 🧱 2. Cấu hình Database cho Backend

Mở file `src/main/resources/application.yml` và chỉnh thông tin MySQL:
```yml
spring.datasource.url=jdbc:mysql://localhost:3306/pcshop
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
api.prefix=api/v1
