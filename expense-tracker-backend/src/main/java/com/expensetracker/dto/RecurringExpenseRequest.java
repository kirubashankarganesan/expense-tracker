package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RecurringExpenseRequest {

    @NotNull
    private Long categoryId;

    @NotNull
    private BigDecimal amount;

    private String description;

    @NotBlank
    private String frequency;

    @NotNull
    private LocalDate nextDueDate;
}
