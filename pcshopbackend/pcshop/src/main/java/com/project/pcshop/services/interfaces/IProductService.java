package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.ProductDTO;
import com.project.pcshop.dtos.ProductImageDTO;
import com.project.pcshop.models.Product;
import com.project.pcshop.models.ProductImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    Product createProduct(ProductDTO productDTO);
    Product updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
    Product getProductById(Long id);
    Page<Product> getAllProducts(Pageable pageable);
    Page<Product> getProductsByCategory(Long categoryId, Pageable pageable);
    ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws Exception;
    List<ProductImage> getImageByProductId(Long productId);
}
