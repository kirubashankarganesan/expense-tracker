package com.expensetracker.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {

    @NotNull
    private Long categoryId;

    @NotNull
    private BigDecimal amount;

    private String description;

    @NotNull
    private LocalDate expenseDate;

    private boolean recurring;
}