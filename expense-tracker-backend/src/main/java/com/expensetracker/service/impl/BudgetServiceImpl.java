package com.expensetracker.service.impl;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.DuplicateResourceException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

        private final BudgetRepository budgetRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;

        @Override
        public BudgetResponse createBudget(BudgetRequest request, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                budgetRepository.findByUserAndCategoryIdAndMonth(
                                user,
                                request.getCategoryId(),
                                request.getMonth()).ifPresent(budget -> {
                                        throw new DuplicateResourceException("Budget already exists");
                                });

                Budget budget = Budget.builder()
                                .monthlyLimit(request.getMonthlyLimit())
                                .month(request.getMonth())
                                .category(category)
                                .user(user)
                                .build();

                budget = budgetRepository.save(budget);

                return new BudgetResponse(
                                budget.getId(),
                                category.getName(),
                                budget.getMonthlyLimit(),
                                budget.getMonth());
        }

        @Override
        public List<BudgetResponse> getBudgets(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return budgetRepository.findByUser(user)
                                .stream()
                                .map(budget -> new BudgetResponse(
                                                budget.getId(),
                                                budget.getCategory().getName(),
                                                budget.getMonthlyLimit(),
                                                budget.getMonth()))
                                .toList();
        }

        @Override
        public BudgetResponse updateBudget(Long id,
                        BudgetRequest request,
                        String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Budget budget = budgetRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

                if (!budget.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                budget.setCategory(category);
                budget.setMonthlyLimit(request.getMonthlyLimit());
                budget.setMonth(request.getMonth());

                budget = budgetRepository.save(budget);

                return new BudgetResponse(
                                budget.getId(),
                                category.getName(),
                                budget.getMonthlyLimit(),
                                budget.getMonth());
        }

        @Override
        public void deleteBudget(Long id, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Budget budget = budgetRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

                if (!budget.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                budgetRepository.delete(budget);
        }
}