package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetResponse {

    private Long id;

    private String category;

    private BigDecimal monthlyLimit;

    private String month;
}