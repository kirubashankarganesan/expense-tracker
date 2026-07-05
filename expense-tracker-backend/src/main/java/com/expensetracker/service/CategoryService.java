package com.expensetracker.service;

import com.expensetracker.dto.CategoryRequest;
import com.expensetracker.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse addCategory(CategoryRequest request, String email);

    List<CategoryResponse> getAllCategories(String email);

    CategoryResponse updateCategory(Long id, CategoryRequest request, String email);

    void deleteCategory(Long id, String email);
}