package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.product.ProductDTO;
import com.project.pcshop.dtos.product.ProductDiscountDTO;
import com.project.pcshop.dtos.product.ProductFeaturedDTO;
import com.project.pcshop.responses.ProductImageResponse;
import com.project.pcshop.responses.ProductResponse;
import com.project.pcshop.services.interfaces.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<ApiResponse<?>> createProduct(
            @Valid @RequestBody ProductDTO productDTO
    ) throws Exception {
        ProductResponse productResponse = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .status(HttpStatus.CREATED)
                .message("Product created successfully")
                .responseObject(productResponse)
                .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable("id") Long id
    ) throws Exception {
        ProductResponse productResponse = productService.getProductById(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Got product with id = " + id + " successfully")
                .responseObject(productResponse)
                .build()
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<?>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int limit,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String searchKey
    ) {
        Page<ProductResponse> productsPage = productService.getAllProducts(page, limit, sort, searchKey);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get products successfully")
                .responseObject(productsPage)
                .build()
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<?>> getProductsByCategory(
            @PathVariable("categoryId") Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String sort
    ) {
        Page<ProductResponse> productsPage = productService.getProductsByCategory(page, limit, sort, categoryId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get products with category_id = " + categoryId + " successfully")
                .responseObject(productsPage)
                .build()
        );
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse<?>> getProductsByBrand(
            @PathVariable("brandId") Long brandId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String sort
    ) {
        Page<ProductResponse> productsPage = productService.getProductsByBrand(page, limit, sort, brandId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get products with brand_id = " + brandId + " successfully")
                .responseObject(productsPage)
                .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchProduct(
            @RequestParam String keyword
    ) {
        List<ProductResponse> productResponses = productService.searchProducts(keyword);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Searched products with keyword = " + keyword + " successfully")
                .responseObject(productResponses)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateProduct(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProductDTO productDTO
    ) throws Exception {
        ProductResponse productResponse = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Updated product with id = " + id + " successfully")
                .responseObject(productResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/discount")
    public ResponseEntity<ApiResponse<?>> discountProduct(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProductDiscountDTO  productDiscountDTO
    ) throws Exception {
        ProductResponse productResponse = productService.discountProduct(id, productDiscountDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Updated discount value of product with id = " + id + " successfully")
                .responseObject(productResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/recommend")
    public ResponseEntity<ApiResponse<?>> recommendProduct(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProductFeaturedDTO productFeaturedDTO
    ) throws Exception {
        ProductResponse productResponse = productService.recommendProduct(id, productFeaturedDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Featured product with id = " + id + " successfully")
                .responseObject(productResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProduct(
            @PathVariable("id") Long id
    ) throws Exception {
        productService.deleteProduct(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Deleted product with id = " + id + " successfully")
                .responseObject(null)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<?>> uploadImages(
            @RequestParam("file") MultipartFile[] files,
            @PathVariable("id") Long id
    ) throws Exception {
        List<ProductImageResponse> productImageResponses = productService.createProductImage(id, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .status(HttpStatus.CREATED)
                .message("Created images for product with id = " + id + " successfully")
                .responseObject(productImageResponses)
                .build()
        );
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<ApiResponse<?>> getImagesByProduct(
            @PathVariable("id") Long id
    ) throws Exception {
        List<ProductImageResponse> productImageResponses = productService.getImageByProductId(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Got images of product with id = " + id )
                .responseObject(productImageResponses)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}/set-thumbnail")
    public ResponseEntity<ApiResponse<?>> setThumbnail (
            @PathVariable("id") Long id,
            @RequestParam("imageUrl") String imageUrl
    ) throws Exception {
        ProductResponse productResponse = productService.setThumbnail(id, imageUrl);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Changed thumbnail of product with id = " + id )
                .responseObject(productResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}/images")
    public ResponseEntity<ApiResponse<?>> deleteImages (
            @RequestParam("imageUrl") Long[] imageIds
    ) throws Exception {
        productService.deleteImages(imageIds);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Deleted images")
                .responseObject(null)
                .build()
        );
    }
}