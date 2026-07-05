package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ExpenseResponse addExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        return expenseService.addExpense(request, authentication.getName());
    }

    @GetMapping("/all")
    public List<ExpenseResponse> getAllExpenses(Authentication authentication) {

        return expenseService.getAllExpenses(authentication.getName());
    }

    @PutMapping("/{id}")
    public ExpenseResponse updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        return expenseService.updateExpense(
                id,
                request,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(
            @PathVariable Long id,
            Authentication authentication) {

        expenseService.deleteExpense(id, authentication.getName());
    }

    // Pagination + Sorting
    @GetMapping
    public Page<ExpenseResponse> getExpenses(

            Authentication authentication,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "expenseDate") String sortBy,

            @RequestParam(defaultValue = "desc") String direction) {

        return expenseService.getExpenses(
                authentication.getName(),
                page,
                size,
                sortBy,
                direction);
    }

    // Search
    @GetMapping("/search")
    public Page<ExpenseResponse> searchExpenses(

            Authentication authentication,

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        return expenseService.searchExpenses(
                authentication.getName(),
                keyword,
                page,
                size);
    }

    // Filter by Category
    @GetMapping("/category/{categoryId}")
    public Page<ExpenseResponse> filterCategory(

            Authentication authentication,

            @PathVariable Long categoryId,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        return expenseService.filterByCategory(
                authentication.getName(),
                categoryId,
                page,
                size);
    }

    // Filter by Date
    @GetMapping("/date")
    public Page<ExpenseResponse> filterDate(

            Authentication authentication,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        return expenseService.filterByDate(
                authentication.getName(),
                startDate,
                endDate,
                page,
                size);
    }
}