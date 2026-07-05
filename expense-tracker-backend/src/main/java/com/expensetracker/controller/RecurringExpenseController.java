package com.expensetracker.controller;

import com.expensetracker.dto.RecurringExpenseRequest;
import com.expensetracker.dto.RecurringExpenseResponse;
import com.expensetracker.service.RecurringExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;

    @PostMapping
    public RecurringExpenseResponse create(
            @Valid @RequestBody RecurringExpenseRequest request,
            Authentication authentication) {

        return recurringExpenseService.create(request, authentication.getName());
    }

    @GetMapping
    public List<RecurringExpenseResponse> getAll(Authentication authentication) {
        return recurringExpenseService.getAll(authentication.getName());
    }

    @PutMapping("/{id}")
    public RecurringExpenseResponse update(
            @PathVariable Long id,
            @Valid @RequestBody RecurringExpenseRequest request,
            Authentication authentication) {

        return recurringExpenseService.update(id, request, authentication.getName());
    }

    @PatchMapping("/{id}/toggle")
    public RecurringExpenseResponse toggleActive(
            @PathVariable Long id,
            Authentication authentication) {

        return recurringExpenseService.toggleActive(id, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            Authentication authentication) {

        recurringExpenseService.delete(id, authentication.getName());
    }
}
