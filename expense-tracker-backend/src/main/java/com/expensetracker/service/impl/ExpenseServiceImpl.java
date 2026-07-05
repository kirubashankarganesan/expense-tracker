package com.expensetracker.service.impl;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.BudgetAlertService;
import com.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

        private final ExpenseRepository expenseRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final BudgetAlertService budgetAlertService;

        @Override
        public ExpenseResponse addExpense(ExpenseRequest request, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                Expense expense = Expense.builder()
                                .amount(request.getAmount())
                                .description(request.getDescription())
                                .expenseDate(request.getExpenseDate())
                                .recurring(request.isRecurring())
                                .category(category)
                                .user(user)
                                .build();

                expense = expenseRepository.save(expense);

                budgetAlertService.checkBudget(user, category);

                return new ExpenseResponse(
                                expense.getId(),
                                category.getName(),
                                expense.getAmount(),
                                expense.getDescription(),
                                expense.getExpenseDate(),
                                expense.isRecurring());
        }

        @Override
        public List<ExpenseResponse> getAllExpenses(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return expenseRepository.findByUser(user)
                                .stream()
                                .map(expense -> new ExpenseResponse(
                                                expense.getId(),
                                                expense.getCategory().getName(),
                                                expense.getAmount(),
                                                expense.getDescription(),
                                                expense.getExpenseDate(),
                                                expense.isRecurring()))
                                .toList();
        }

        @Override
        public ExpenseResponse updateExpense(Long id,
                        ExpenseRequest request,
                        String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Expense expense = expenseRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

                if (!expense.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                expense.setCategory(category);
                expense.setAmount(request.getAmount());
                expense.setDescription(request.getDescription());
                expense.setExpenseDate(request.getExpenseDate());
                expense.setRecurring(request.isRecurring());
                expense = expenseRepository.save(expense);

                budgetAlertService.checkBudget(user, category);

                return new ExpenseResponse(
                                expense.getId(),
                                category.getName(),
                                expense.getAmount(),
                                expense.getDescription(),
                                expense.getExpenseDate(),
                                expense.isRecurring());
        }

        @Override
        public void deleteExpense(Long id, String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Expense expense = expenseRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

                if (!expense.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                expenseRepository.delete(expense);
        }

        @Override
        public Page<ExpenseResponse> getExpenses(String email,
                        int page,
                        int size,
                        String sortBy,
                        String direction) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Sort sort = direction.equalsIgnoreCase("desc")
                                ? Sort.by(sortBy).descending()
                                : Sort.by(sortBy).ascending();

                Pageable pageable = PageRequest.of(page, size, sort);

                return expenseRepository.findByUser(user, pageable)
                                .map(expense -> new ExpenseResponse(
                                                expense.getId(),
                                                expense.getCategory().getName(),
                                                expense.getAmount(),
                                                expense.getDescription(),
                                                expense.getExpenseDate(),
                                                expense.isRecurring()));
        }

        @Override
        public Page<ExpenseResponse> searchExpenses(String email,
                        String keyword,
                        int page,
                        int size) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Pageable pageable = PageRequest.of(page, size);

                return expenseRepository
                                .findByUserAndDescriptionContainingIgnoreCase(
                                                user,
                                                keyword,
                                                pageable)
                                .map(expense -> new ExpenseResponse(
                                                expense.getId(),
                                                expense.getCategory().getName(),
                                                expense.getAmount(),
                                                expense.getDescription(),
                                                expense.getExpenseDate(),
                                                expense.isRecurring()));
        }

        @Override
        public Page<ExpenseResponse> filterByCategory(String email,
                        Long categoryId,
                        int page,
                        int size) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Pageable pageable = PageRequest.of(page, size);

                return expenseRepository.findByUserAndCategoryId(
                                user,
                                categoryId,
                                pageable).map(
                                                expense -> new ExpenseResponse(
                                                                expense.getId(),
                                                                expense.getCategory().getName(),
                                                                expense.getAmount(),
                                                                expense.getDescription(),
                                                                expense.getExpenseDate(),
                                                                expense.isRecurring()));
        }

        @Override
        public Page<ExpenseResponse> filterByDate(String email,
                        LocalDate startDate,
                        LocalDate endDate,
                        int page,
                        int size) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Pageable pageable = PageRequest.of(page, size);

                return expenseRepository.findByUserAndExpenseDateBetween(
                                user,
                                startDate,
                                endDate,
                                pageable).map(
                                                expense -> new ExpenseResponse(
                                                                expense.getId(),
                                                                expense.getCategory().getName(),
                                                                expense.getAmount(),
                                                                expense.getDescription(),
                                                                expense.getExpenseDate(),
                                                                expense.isRecurring()));
        }

}