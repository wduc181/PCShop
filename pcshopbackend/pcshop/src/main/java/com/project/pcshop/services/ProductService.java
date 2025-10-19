package com.project.pcshop.services;

import com.project.pcshop.dtos.ProductDTO;
import com.project.pcshop.dtos.ProductDiscountDTO;
import com.project.pcshop.dtos.ProductFeaturedDTO;
import com.project.pcshop.dtos.ProductImageDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.models.Brand;
import com.project.pcshop.models.Category;
import com.project.pcshop.models.Product;
import com.project.pcshop.models.ProductImage;
import com.project.pcshop.repositories.BrandRepository;
import com.project.pcshop.repositories.CategoryRepository;
import com.project.pcshop.repositories.ProductImageRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.services.interfaces.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductImageRepository productImageRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository, ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productImageRepository = productImageRepository;
    }

    @Override
    public Product createProduct(ProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = null;
        if (dto.getBrandId() != null) {
            brand = brandRepository.findById(dto.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
        }

        Product product = Product.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .discount(dto.getDiscount())
                .stockQuantity(dto.getStockQuantity())
                .thumbnail(dto.getThumbnail())
                .description(dto.getDescription())
                .warrantyMonths(12)
                .isActive(true)
                .isFeatured(false)
                .category(category)
                .brand(brand)
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDiscount(dto.getDiscount());
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategory_Id(categoryId, pageable);
    }

    @Override
    public Page<Product> getProductsByBrand(Long brandId, Pageable pageable) {
        return productRepository.findByBrand_Id(brandId, pageable);
    }

    @Override
    public ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO)
            throws Exception {
        Product existingProduct = productRepository
                .findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Cannot find product ID = "
                        + productImageDTO.getProductId() + "."));

        ProductImage newProductImage = ProductImage.builder()
                .product(existingProduct)
                .imageUrl(productImageDTO.getImageUrl())
                .build();

        int numberOfImages = productImageRepository.findByProductId(productId).size();
        if (numberOfImages >= 5) {
            throw new InvalidParamException("Max number of images is 5.");
        }

        ProductImage savedImage = productImageRepository.save(newProductImage);

        if (existingProduct.getThumbnail() == null || existingProduct.getThumbnail().isEmpty()) {
            existingProduct.setThumbnail(savedImage.getImageUrl());
            productRepository.save(existingProduct);
        }

        return savedImage;
    }

    @Override
    public List<ProductImage> getImageByProductId(Long productId) {
        return  productImageRepository.findByProductId(productId);
    }

    @Override
    public Product discountProduct(Long id, ProductDiscountDTO dto) {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            product.setDiscount(dto.getDiscount());
            return productRepository.save(product);
    }

    @Override
    public Product recommendProduct(Long id, ProductFeaturedDTO productFeaturedDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsFeatured(productFeaturedDTO.isFeatured());
        return productRepository.save(product);
    }
}
