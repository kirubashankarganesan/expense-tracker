package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private BigDecimal totalExpense;

    private BigDecimal monthlyExpense;

    private Long totalCategories;

    private Long totalExpenses;

    private Long totalBudgets;
}