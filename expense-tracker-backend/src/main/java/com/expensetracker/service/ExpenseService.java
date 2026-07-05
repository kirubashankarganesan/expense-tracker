package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;

import org.springframework.data.domain.Page;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

        ExpenseResponse addExpense(ExpenseRequest request, String email);

        List<ExpenseResponse> getAllExpenses(String email);

        ExpenseResponse updateExpense(Long id, ExpenseRequest request, String email);

        void deleteExpense(Long id, String email);

        Page<ExpenseResponse> getExpenses(
                        String email,
                        int page,
                        int size,
                        String sortBy,
                        String direction);

        Page<ExpenseResponse> searchExpenses(
                        String email,
                        String keyword,
                        int page,
                        int size);

        Page<ExpenseResponse> filterByCategory(
                        String email,
                        Long categoryId,
                        int page,
                        int size);

        Page<ExpenseResponse> filterByDate(
                        String email,
                        LocalDate startDate,
                        LocalDate endDate,
                        int page,
                        int size);
}