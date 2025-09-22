package com.project.pcshop.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String fullname;

    @Column(name = "phone_number", length = 15, nullable = false)
    private String phoneNumber;

    @Column(length = 200)
    private String address;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    // chỉ lưu roleId, không mapping sang entity Role
    @Column(name = "role_id")
    private Integer roleId = 2; // mặc định CUSTOMER
}
