package com.project.pcshop.repositories;

import com.project.pcshop.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);
    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);
}
