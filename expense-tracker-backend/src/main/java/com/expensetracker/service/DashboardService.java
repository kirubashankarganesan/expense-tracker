package com.expensetracker.service;

import com.expensetracker.dto.CategoryExpenseResponse;
import com.expensetracker.dto.DashboardResponse;
import com.expensetracker.dto.MonthlyExpenseResponse;

import java.util.List;

public interface DashboardService {

    DashboardResponse getDashboard(String email);

    List<CategoryExpenseResponse> getCategoryWiseExpense(String email);

    List<MonthlyExpenseResponse> getMonthlyExpenseTrend(String email);
}