package com.expensetracker.service.impl;

import com.expensetracker.dto.CategoryExpenseResponse;
import com.expensetracker.dto.DashboardResponse;
import com.expensetracker.dto.MonthlyExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

        private final UserRepository userRepository;
        private final ExpenseRepository expenseRepository;
        private final CategoryRepository categoryRepository;
        private final BudgetRepository budgetRepository;

        @Override
        public DashboardResponse getDashboard(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<Expense> expenses = expenseRepository.findByUser(user);

                BigDecimal totalExpense = BigDecimal.ZERO;
                BigDecimal monthlyExpense = BigDecimal.ZERO;

                YearMonth currentMonth = YearMonth.now();

                for (Expense expense : expenses) {

                        totalExpense = totalExpense.add(expense.getAmount());

                        if (YearMonth.from(expense.getExpenseDate()).equals(currentMonth)) {
                                monthlyExpense = monthlyExpense.add(expense.getAmount());
                        }
                }

                return new DashboardResponse(
                                totalExpense,
                                monthlyExpense,
                                (long) categoryRepository.findByUser(user).size(),
                                (long) expenses.size(),
                                (long) budgetRepository.findByUser(user).size());
        }

        @Override
        public List<CategoryExpenseResponse> getCategoryWiseExpense(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<Expense> expenses = expenseRepository.findByUser(user);

                Map<String, BigDecimal> map = new HashMap<>();

                for (Expense expense : expenses) {

                        String category = expense.getCategory().getName();

                        map.put(
                                        category,
                                        map.getOrDefault(category, BigDecimal.ZERO)
                                                        .add(expense.getAmount()));
                }

                List<CategoryExpenseResponse> response = new ArrayList<>();

                map.forEach((category, amount) -> response.add(new CategoryExpenseResponse(category, amount)));

                return response;
        }

        @Override
        public List<MonthlyExpenseResponse> getMonthlyExpenseTrend(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<Expense> expenses = expenseRepository.findByUser(user);

                Map<String, BigDecimal> map = new TreeMap<>();

                for (Expense expense : expenses) {

                        String month = YearMonth
                                        .from(expense.getExpenseDate())
                                        .toString();

                        map.put(
                                        month,
                                        map.getOrDefault(month, BigDecimal.ZERO)
                                                        .add(expense.getAmount()));
                }

                List<MonthlyExpenseResponse> response = new ArrayList<>();

                map.forEach((month, amount) -> response.add(new MonthlyExpenseResponse(month, amount)));

                return response;
        }
}