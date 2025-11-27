package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.category.CategoryDTO;
import com.project.pcshop.responses.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryDTO dto) throws Exception;
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(Long id, CategoryDTO dto) throws Exception;
    void deleteCategory(Long id);
}
