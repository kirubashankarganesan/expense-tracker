package com.expensetracker.controller;

import com.expensetracker.dto.CategoryRequest;
import com.expensetracker.dto.CategoryResponse;
import com.expensetracker.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public CategoryResponse addCategory(
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        return categoryService.addCategory(request, authentication.getName());
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories(
            Authentication authentication) {

        return categoryService.getAllCategories(authentication.getName());
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        return categoryService.updateCategory(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {

        categoryService.deleteCategory(id, authentication.getName());
    }
}