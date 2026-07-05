package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;

import java.util.List;

public interface BudgetService {

    BudgetResponse createBudget(BudgetRequest request, String email);

    List<BudgetResponse> getBudgets(String email);

    BudgetResponse updateBudget(Long id, BudgetRequest request, String email);

    void deleteBudget(Long id, String email);
}