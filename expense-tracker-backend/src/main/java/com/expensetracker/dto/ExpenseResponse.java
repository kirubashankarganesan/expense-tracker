package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;

    private String category;

    private BigDecimal amount;

    private String description;

    private LocalDate expenseDate;

    private boolean recurring;
}