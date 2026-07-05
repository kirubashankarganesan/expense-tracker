package com.expensetracker.controller;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public BudgetResponse createBudget(
            @Valid @RequestBody BudgetRequest request,
            Authentication authentication) {

        return budgetService.createBudget(request, authentication.getName());
    }

    @GetMapping
    public List<BudgetResponse> getBudgets(Authentication authentication) {

        return budgetService.getBudgets(authentication.getName());
    }

    @PutMapping("/{id}")
    public BudgetResponse updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request,
            Authentication authentication) {

        return budgetService.updateBudget(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(
            @PathVariable Long id,
            Authentication authentication) {

        budgetService.deleteBudget(id, authentication.getName());
    }
}