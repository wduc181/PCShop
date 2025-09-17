package com.project.pcshop.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 350)
    private String name;

    @Column(nullable = false)
    private Float price;

    private Float discount = 0f;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(length = 300)
    private String thumbnail;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "warranty_months")
    private Integer warrantyMonths = 12;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;
}
