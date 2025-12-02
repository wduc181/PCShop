package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.product.ProductDTO;
import com.project.pcshop.dtos.product.ProductDiscountDTO;
import com.project.pcshop.dtos.product.ProductFeaturedDTO;
import com.project.pcshop.responses.ProductImageResponse;
import com.project.pcshop.responses.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductDTO productDTO) throws Exception;
    ProductResponse getProductById(Long id) throws Exception;
    Page<ProductResponse> getAllProducts(Integer page, Integer limit, String sort, String searchKey);
    Page<ProductResponse> getProductsByCategory(Integer page, Integer limit, String sort, Long categoryId);
    Page<ProductResponse> getProductsByBrand(Integer page, Integer limit, String sort, Long brandId);
    List<ProductResponse> searchProducts(String keyword);
    ProductResponse updateProduct(Long id, ProductDTO productDTO) throws Exception;
    ProductResponse discountProduct(Long id, ProductDiscountDTO productDiscountDTO) throws Exception;
    ProductResponse recommendProduct(Long id, ProductFeaturedDTO productFeaturedDTO) throws Exception;
    void deleteProduct(Long id) throws Exception;

    List<ProductImageResponse> createProductImage(Long productId, MultipartFile[] files) throws Exception;
    List<ProductImageResponse> getImageByProductId(Long productId) throws Exception;
    ProductResponse setThumbnail(Long id, String imageUrl) throws Exception;
    void deleteImages(Long[] imageIds) throws Exception;
}
