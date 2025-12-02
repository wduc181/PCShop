package com.project.pcshop.repositories;

import com.project.pcshop.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);
    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String name);
}
