package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.CategoryDTO;
import com.project.pcshop.models.entities.Category;

import java.util.List;

public interface ICategoryService {
    Category createCategory(CategoryDTO dto);
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category updateCategory(Long id, CategoryDTO dto);
    void deleteCategory(Long id);
}
