package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RecurringExpenseResponse {

    private Long id;

    private String category;

    private BigDecimal amount;

    private String description;

    private String frequency;

    private LocalDate nextDueDate;

    private boolean active;
}