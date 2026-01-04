package com.project.pcshop.services.implementations;

import com.fasterxml.jackson.core.type.TypeReference;
import com.project.pcshop.common.CacheConst;
import com.project.pcshop.dtos.category.CategoryDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.entities.Category;
import com.project.pcshop.repositories.CategoryRepository;
import com.project.pcshop.responses.CategoryResponse;
import com.project.pcshop.services.interfaces.CategoryService;
import com.project.pcshop.services.interfaces.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final RedisService  redisService;

    @Transactional
    @Override
    public CategoryResponse createCategory(CategoryDTO categoryDTO) throws Exception {
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new InvalidParamException("Category name already exists");
        }
        Category category = Category.builder()
                .name(categoryDTO.getName())
                .description(categoryDTO.getDescription())
                .build();
        categoryRepository.save(category);
        redisService.delete(CacheConst.CATEGORY_ALL);
        return CategoryResponse.fromCategory(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<CategoryResponse> cachedData = redisService.get(
                CacheConst.CATEGORY_ALL,
                new TypeReference<>() {
                }
        );
        if (cachedData != null) {
            return cachedData;
        }

        List<CategoryResponse> categoryResponse = categoryRepository.findAll().stream()
                .map(CategoryResponse::fromCategory)
                .toList();
        redisService.setWithTimeout(CacheConst.CATEGORY_ALL, categoryResponse, CacheConst.DEFAULT_TTL, TimeUnit.HOURS);
        return categoryResponse;
    }

    @Transactional
    @Override
    public CategoryResponse updateCategory(Long id, CategoryDTO categoryDTO) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Category not found"));

        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        categoryRepository.save(category);

        redisService.delete(CacheConst.CATEGORY_ALL);
        return CategoryResponse.fromCategory(category);
    }

    @Transactional
    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
        redisService.delete(CacheConst.CATEGORY_ALL);
    }
}
