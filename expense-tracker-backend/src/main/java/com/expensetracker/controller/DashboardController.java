package com.expensetracker.controller;

import com.expensetracker.dto.CategoryExpenseResponse;
import com.expensetracker.dto.DashboardResponse;
import com.expensetracker.dto.MonthlyExpenseResponse;
import com.expensetracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(Authentication authentication) {
        return dashboardService.getDashboard(authentication.getName());
    }

    @GetMapping("/category")
    public List<CategoryExpenseResponse> categoryWise(Authentication authentication) {
        return dashboardService.getCategoryWiseExpense(authentication.getName());
    }

    @GetMapping("/monthly")
    public List<MonthlyExpenseResponse> monthly(Authentication authentication) {
        return dashboardService.getMonthlyExpenseTrend(authentication.getName());
    }
}