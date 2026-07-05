package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull
    private Long categoryId;

    @NotNull
    private BigDecimal monthlyLimit;

    @NotBlank
    private String month;
}