package com.project.pcshop.controllers;

import com.project.pcshop.dtos.CategoryDTO;
import com.project.pcshop.models.Category;
import com.project.pcshop.responses.CategoryResponse;
import com.project.pcshop.services.interfaces.ICategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final ICategoryService categoryService;

    @PostMapping("")
    public ResponseEntity<?> addCategories(
            @Valid @RequestBody CategoryDTO categoryDTO,
            BindingResult result)
    {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Category category = categoryService.createCategory(categoryDTO);
            return ResponseEntity.ok(CategoryResponse.fromCategory(category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> categoryResponses = categories.stream()
                .map(CategoryResponse::fromCategory)
                .toList();
        return ResponseEntity.ok(categoryResponses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO,
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
            Category updatedCategory = categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(CategoryResponse.fromCategory(updatedCategory));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id
    ) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Test delete category" + id);
    }
}
