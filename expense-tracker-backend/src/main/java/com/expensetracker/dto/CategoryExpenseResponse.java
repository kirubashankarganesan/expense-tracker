package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CategoryExpenseResponse {

    private String category;

    private BigDecimal amount;
}