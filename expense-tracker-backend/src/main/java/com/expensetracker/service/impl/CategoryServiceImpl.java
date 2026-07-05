package com.expensetracker.service.impl;

import com.expensetracker.dto.CategoryRequest;
import com.expensetracker.dto.CategoryResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.DuplicateResourceException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;

        @Override
        public CategoryResponse addCategory(CategoryRequest request, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (categoryRepository.existsByNameAndUser(request.getName(), user)) {
                        throw new DuplicateResourceException("Category already exists");
                }

                Category category = Category.builder()
                                .name(request.getName())
                                .user(user)
                                .build();

                Category savedCategory = categoryRepository.save(category);

                return new CategoryResponse(
                                savedCategory.getId(),
                                savedCategory.getName());
        }

        @Override
        public List<CategoryResponse> getAllCategories(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return categoryRepository.findByUser(user)
                                .stream()
                                .map(category -> new CategoryResponse(
                                                category.getId(),
                                                category.getName()))
                                .toList();
        }

        @Override
        public CategoryResponse updateCategory(Long id,
                        CategoryRequest request,
                        String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Category category = categoryRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                if (!category.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                category.setName(request.getName());

                Category updatedCategory = categoryRepository.save(category);

                return new CategoryResponse(
                                updatedCategory.getId(),
                                updatedCategory.getName());
        }

        @Override
        public void deleteCategory(Long id, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Category category = categoryRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                if (!category.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                categoryRepository.delete(category);
        }
}