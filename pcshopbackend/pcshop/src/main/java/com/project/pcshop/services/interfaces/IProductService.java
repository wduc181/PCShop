package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.ProductDTO;
import com.project.pcshop.dtos.ProductDiscountDTO;
import com.project.pcshop.dtos.ProductFeaturedDTO;
import com.project.pcshop.dtos.ProductImageDTO;
import com.project.pcshop.models.entities.Product;
import com.project.pcshop.models.entities.ProductImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    Product createProduct(ProductDTO productDTO);
    Product updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
    Product getProductById(Long id);
    Page<Product> getAllProducts(Pageable pageable, String searchKey);
    Page<Product> getProductsByCategory(Long categoryId, Pageable pageable);
    Page<Product> getProductsByBrand(Long brandId, Pageable pageable);
    ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws Exception;
    List<ProductImage> getImageByProductId(Long productId);
    Product discountProduct(Long id, ProductDiscountDTO productDiscountDTO);
    Product recommendProduct(Long id, ProductFeaturedDTO productFeaturedDTO);
    List<Product> searchProducts(String keyword);
}
