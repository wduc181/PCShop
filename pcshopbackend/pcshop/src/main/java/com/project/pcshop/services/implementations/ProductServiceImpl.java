package com.project.pcshop.services.implementations;

import com.fasterxml.jackson.core.type.TypeReference;
import com.project.pcshop.common.CacheConst;
import com.project.pcshop.dtos.product.ProductDTO;
import com.project.pcshop.dtos.product.ProductDiscountDTO;
import com.project.pcshop.dtos.product.ProductFeaturedDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.entities.Brand;
import com.project.pcshop.entities.Category;
import com.project.pcshop.entities.Product;
import com.project.pcshop.entities.ProductImage;
import com.project.pcshop.repositories.BrandRepository;
import com.project.pcshop.repositories.CategoryRepository;
import com.project.pcshop.repositories.ProductImageRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.responses.ProductImageResponse;
import com.project.pcshop.responses.ProductResponse;
import com.project.pcshop.services.interfaces.FileStorageService;
import com.project.pcshop.services.interfaces.ProductService;
import com.project.pcshop.services.interfaces.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductImageRepository productImageRepository;
    private final FileStorageService fileStorageService;
    private final RedisService redisService;

    @Transactional
    @Override
    public ProductResponse createProduct(
            ProductDTO productDTO
    ) throws Exception {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new DataNotFoundException("Category not found"));

        Brand brand = brandRepository.findById(productDTO.getBrandId())
                .orElseThrow(() -> new DataNotFoundException("Brand not found"));
        
        if(productRepository.existsByName(productDTO.getName())) {
            throw new InvalidParamException("Product already exists");
        }

        Product product = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .discount(productDTO.getDiscount())
                .stockQuantity(productDTO.getStockQuantity())
                .thumbnail(productDTO.getThumbnail())
                .description(productDTO.getDescription())
                .warrantyMonths(12)
                .isActive(true)
                .isFeatured(false)
                .category(category)
                .brand(brand)
                .build();
        productRepository.save(product);

        redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + category.getId() + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + brand.getId() + "*");
        return ProductResponse.fromProduct(product);
    }

    @Override
    public ProductResponse getProductById(
            Long id
    ) throws Exception {
        String cacheKey = CacheConst.productKey(id);
        ProductResponse cachedData = redisService.get(
                cacheKey,
                new TypeReference<>() {}
        );
        if(cachedData != null) {
            return cachedData;
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));
        ProductResponse productResponse = ProductResponse.fromProduct(product);

        redisService.setWithTimeout(
                cacheKey,
                productResponse,
                CacheConst.PRODUCT_TLL,
                TimeUnit.MINUTES
        );
        return productResponse;
    }

    private Sort sortProductsBy(
            String sort
    ) {
        Sort sortSpec = Sort.by("createdAt").descending();
        if (sort != null) {
            String s = sort.trim().toLowerCase();
            sortSpec = switch (s) {
                case "discount" -> Sort.by("discount").descending();
                case "featured" -> Sort.by("isFeatured").descending();
                case "price_asc" -> Sort.by("price").ascending();
                case "price_desc" -> Sort.by("price").descending();
                case "alphabet" -> Sort.by("name").ascending();
                default -> sortSpec;
            };
        }
        return sortSpec;
    }

    @Override
    public Page<ProductResponse> getAllProducts(
            Integer page,
            Integer limit,
            String sort,
            String searchKey
    ) {
        String cacheKey = CacheConst.productAllKey(page, limit, sort, searchKey);
        Page<ProductResponse> cachedData = redisService.get(
                cacheKey,
                new TypeReference<>() {}
        );
        if (cachedData != null) {
            return cachedData;
        }

        Sort sortSpec = sortProductsBy(sort);
        PageRequest pageRequest = PageRequest.of(page - 1, limit, sortSpec);
        Page<ProductResponse> productResponsePage;
        if (searchKey == null || searchKey.trim().isEmpty()) {
            productResponsePage = productRepository.findAll(pageRequest).map(ProductResponse::fromProduct);
        } else {
            productResponsePage = productRepository.findByNameContainingIgnoreCase(
                    searchKey.trim(),
                    pageRequest
            ).map(ProductResponse::fromProduct);
        }

        redisService.setWithTimeout(
                cacheKey,
                productResponsePage,
                CacheConst.PRODUCT_LIST_TLL,
                TimeUnit.MINUTES
        );

        return productResponsePage;
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(
            Integer page,
            Integer limit,
            String sort,
            Long categoryId
    ) {
        String cacheKey = CacheConst.productCategoryKey(page, limit, sort, categoryId);
        Page<ProductResponse> cachedData = redisService.get(
                cacheKey,
                new TypeReference<>() {}
        );
        if (cachedData != null) {
            return cachedData;
        }

        Sort sortSpec = sortProductsBy(sort);
        PageRequest pageRequest = PageRequest.of(page - 1, limit, sortSpec);
        Page<ProductResponse> productResponsePage = productRepository
                .findByCategory_Id(categoryId, pageRequest)
                .map(ProductResponse::fromProduct);

        redisService.setWithTimeout(
                cacheKey,
                productResponsePage,
                CacheConst.PRODUCT_LIST_TLL,
                TimeUnit.MINUTES
        );
        return productResponsePage;
    }

    @Override
    public Page<ProductResponse> getProductsByBrand(
            Integer page,
            Integer limit,
            String sort,
            Long brandId
    ) {
        String cacheKey = CacheConst.productBrandKey(page, limit, sort, brandId);
        Page<ProductResponse> cachedData = redisService.get(
                cacheKey,
                new TypeReference<>() {}
        );
        if (cachedData != null) {
            return cachedData;
        }

        Sort sortSpec = sortProductsBy(sort);
        PageRequest pageRequest = PageRequest.of(page - 1, limit, sortSpec);
        Page<ProductResponse> productResponsePage = productRepository
                .findByBrand_Id(brandId, pageRequest)
                .map(ProductResponse::fromProduct);

        redisService.setWithTimeout(
                cacheKey,
                productResponsePage,
                CacheConst.PRODUCT_LIST_TLL,
                TimeUnit.MINUTES
        );

        return productResponsePage;
    }

    @Override
    public List<ProductResponse> searchProducts(
            String keyword
    ) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        return products.stream().map(ProductResponse::fromProduct).toList();
    }

    @Transactional
    @Override
    public ProductResponse updateProduct(Long id, ProductDTO productDTO) throws Exception {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new DataNotFoundException("Category not found"));
        Brand brand = brandRepository.findById(productDTO.getBrandId())
                .orElseThrow(() -> new DataNotFoundException("Brand not found"));
        if(productRepository.existsByName(productDTO.getName())) {
            throw new InvalidParamException("Product already exists");
        }
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setDescription(productDTO.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        productRepository.save(product);

        redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
        redisService.delete(CacheConst.productKey(id));
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + category.getId() + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + brand.getId() + "*");

        return ProductResponse.fromProduct(product);
    }

    @Transactional
    @Override
    public ProductResponse discountProduct(
            Long id,
            ProductDiscountDTO productDTO
    ) throws Exception {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));

        product.setDiscount(productDTO.getDiscount());
        productRepository.save(product);

        redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + "*");

        return ProductResponse.fromProduct(product);
    }

    @Transactional
    @Override
    public ProductResponse recommendProduct(
            Long id,
            ProductFeaturedDTO productFeaturedDTO
    ) throws Exception {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));

        product.setIsFeatured(productFeaturedDTO.isFeatured());
        productRepository.save(product);

        redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + "*");

        return ProductResponse.fromProduct(product);
    }

    @Transactional
    @Override
    public void deleteProduct(
            Long id
    ) throws Exception {
        if (!productRepository.existsById(id)) {
            throw new DataNotFoundException("Product not found");
        }

        productRepository.deleteById(id);

        redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + "*");
        redisService.delete(CacheConst.productKey(id));
    }


    @Transactional
    @Override
    public List<ProductImageResponse> createProductImage(
            Long productId,
            MultipartFile[] files
    ) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));
        if (files == null || files.length == 0) {
            throw new InvalidParamException("Image files not found");
        }
        if (productImageRepository.findByProductId(productId).size() + files.length > 5) {
            throw new InvalidParamException("Maximum number of files exceeded. Maximum number of files for a product is 5");
        }
        List<ProductImage> productImages = new ArrayList<>();
        for (MultipartFile file : files) {
            String savedFileName = fileStorageService.storeImageFile(file, "products");
            ProductImage productImage = ProductImage.builder()
                            .product(product)
                            .imageUrl(savedFileName)
                            .build();
            productImages.add(productImage);
        }
        productImageRepository.saveAll(productImages);

        redisService.delete(CacheConst.productKey(productId));
        redisService.delete(CacheConst.productImageKey(productId));

        return productImages.stream()
                .map(ProductImageResponse::fromProductImage)
                .toList();
    }

    @Override
    public List<ProductImageResponse> getImageByProductId(
            Long productId
    ) throws Exception {
        String cacheKey = CacheConst.productImageKey(productId);
        List<ProductImageResponse> cachedData = redisService.get(
                cacheKey,
                new TypeReference<>() {}
        );
        if (cachedData != null && !cachedData.isEmpty()) {
            return cachedData;
        }

        productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));
        List<ProductImageResponse> productImageResponses = productImageRepository.findByProductId(productId).stream()
                .map(ProductImageResponse::fromProductImage)
                .toList();

        redisService.setWithTimeout(
                cacheKey,
                productImageResponses,
                CacheConst.PRODUCT_IMAGE_TLL,
                TimeUnit.MINUTES
        );

        return productImageResponses;
    }

    @Transactional
    @Override
    public ProductResponse setThumbnail(
            Long id,
            String imageUrl
    ) throws Exception {
        Product existingProduct =  productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));

        existingProduct.setThumbnail(imageUrl);
        productRepository.save(existingProduct);

        redisService.delete(CacheConst.productKey(id));
        redisService.delete(CacheConst.productImageKey(id));
        redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + existingProduct.getCategory().getId() + "*");
        redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + existingProduct.getBrand().getId() + "*");

        return ProductResponse.fromProduct(existingProduct);
    }

    @Transactional
    @Override
    public void deleteImages(
            Long[] imageIds
    ) throws Exception {
        for (Long imageId : imageIds) {
            String fileName = productImageRepository.findById(imageId)
                    .orElseThrow(() -> new DataNotFoundException("Image not found")).getImageUrl();
            ProductImage productImage = productImageRepository.findByImageUrl(fileName);
            if (productImage != null) {
                Product product =  productImage.getProduct();
                redisService.delete(CacheConst.productKey(product.getId()));
                redisService.delete(CacheConst.productImageKey(product.getId()));
                redisService.deleteByPattern(CacheConst.PRODUCT_ALL_PREFIX + "*");
                redisService.deleteByPattern(CacheConst.PRODUCT_BY_CATEGORY_PREFIX + product.getCategory().getId() + "*");
                redisService.deleteByPattern(CacheConst.PRODUCT_BY_BRAND_PREFIX + product.getBrand().getId() + "*");
            }
            productImageRepository.deleteById(imageId);
            fileStorageService.deleteFile(fileName, "products");
        }
    }
}