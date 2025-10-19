package com.project.pcshop.controllers;

import com.project.pcshop.dtos.ProductDTO;
import com.project.pcshop.dtos.ProductDiscountDTO;
import com.project.pcshop.dtos.ProductFeaturedDTO;
import com.project.pcshop.dtos.ProductImageDTO;
import com.project.pcshop.models.Product;
import com.project.pcshop.models.ProductImage;
import com.project.pcshop.responses.ProductListResponse;
import com.project.pcshop.responses.ProductResponse;
import com.project.pcshop.services.interfaces.IProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createProduct(
            @Valid @RequestBody ProductDTO productDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Product created = productService.createProduct(productDTO);
            return ResponseEntity.ok(ProductResponse.fromProduct(created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(ProductResponse.fromProduct(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Sort sortProductsBy(String sort) {
        Sort sortSpec = Sort.by("createdAt").descending();
        if (sort != null) {
            String s = sort.trim().toLowerCase();
            if (s.equals("discount")) {
                sortSpec = Sort.by("discount").descending();
            } else if (s.equals("featured")) {
                sortSpec = Sort.by("isFeatured").descending();
            }
        }
        return sortSpec;
    }

    @GetMapping("")
    public ResponseEntity<ProductListResponse> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String sort
    ) {
        Sort sortSpec = sortProductsBy(sort);
        PageRequest pageRequest = PageRequest.of(page - 1, limit, sortSpec);

        Page<Product> productPage = productService.getAllProducts(pageRequest);

        List<ProductResponse> products = productPage
                .map(ProductResponse::fromProduct)
                .getContent();

        return ResponseEntity.ok(ProductListResponse.builder()
                .products(products)
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ProductListResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort
    ) {
        Sort sortSpec = sortProductsBy(sort);

        PageRequest pageRequest = PageRequest.of(page - 1, size, sortSpec);
        Page<Product> productPage = productService.getProductsByCategory(categoryId, pageRequest);

        List<ProductResponse> products = productPage
                .map(ProductResponse::fromProduct)
                .getContent();

        return ResponseEntity.ok(ProductListResponse.builder()
                .products(products)
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .build());
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ProductListResponse> getProductsByBrand(
            @PathVariable Long brandId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort
    ) {
        Sort sortSpec = Sort.by("createdAt").descending();
        if (sort != null) {
            String s = sort.trim().toLowerCase();
            switch (s) {
                case "asc":
                    sortSpec = Sort.by("price").ascending();
                    break;
                case "desc":
                    sortSpec = Sort.by("price").descending();
                    break;
                case "alphabet":
                    sortSpec = Sort.by("name").ascending();
                    break;
                default:
                    break;
            }
        }

        PageRequest pageRequest = PageRequest.of(page - 1, size, sortSpec);
        Page<Product> productPage = productService.getProductsByBrand(brandId, pageRequest);

        List<ProductResponse> products = productPage
                .map(ProductResponse::fromProduct)
                .getContent();

        return ResponseEntity.ok(ProductListResponse.builder()
                .products(products)
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Product updated = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(ProductResponse.fromProduct(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @RequestParam("file") MultipartFile[] files,
            @PathVariable("id") Long productId
    ) {
        try {
            Product existingProduct = productService.getProductById(productId);
            if (existingProduct == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Product id not found" + productId);
            }
            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest().body("No file found");
            }
            if (files.length > 5) {
                return ResponseEntity.badRequest().body("Maximum number of files exceeded");
            }
            List<ProductImage> productImages = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) continue;

                if (file.getSize() > 10 * 1024 * 1024) {
                    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                            .body("Invalid image size, maximum allowed is 10MB");
                }
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                            .body("Unsupported image type");
                }

                String filename = storeFile(file);
                ProductImage newImage = productService.createProductImage(
                        existingProduct.getId(),
                        ProductImageDTO.builder()
                                .imageUrl(filename)
                                .build()
                );
                productImages.add(newImage);
            }

            return ResponseEntity.ok(productImages);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi upload ảnh: " + e.getMessage());
        }
    }


    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }


    private String storeFile(MultipartFile file) throws IOException {
        if (!isImageFile(file) || file.getOriginalFilename() == null) {
            throw new IOException("Invalid image format.");
        }

        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID() + "_" + filename;

        java.nio.file.Path uploadDir = Paths.get("uploads/products");
        if(!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFilename);

        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFilename;
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<?> getImagesByProduct(@PathVariable("id") Long productId) {
        try {
            List<ProductImage> images = productService.getImageByProductId(productId);
            List<String> imageFileNames = images.stream()
                    .map(ProductImage::getImageUrl)
                    .toList();
            return ResponseEntity.ok(imageFileNames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/discount")
    public ResponseEntity<?> discountProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDiscountDTO  productDiscountDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Product updated = productService.discountProduct(id, productDiscountDTO);
            return ResponseEntity.ok(ProductResponse.fromProduct(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/recommend")
    public ResponseEntity<?> recommendProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductFeaturedDTO productFeaturedDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Product updated = productService.recommendProduct(id, productFeaturedDTO);
            return ResponseEntity.ok(ProductResponse.fromProduct(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}


