package com.expensetracker.service.impl;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.service.BudgetAlertService;
import com.expensetracker.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetAlertServiceImpl implements BudgetAlertService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final MailService mailService;

    @Override
    public void checkBudget(User user, Category category) {

        Budget budget = budgetRepository
                .findByUserAndCategory(user, category)
                .orElse(null);

        if (budget == null)
            return;

        List<Expense> expenses = expenseRepository.findByUserAndCategory(user, category);

        BigDecimal total = BigDecimal.ZERO;

        for (Expense expense : expenses) {
            total = total.add(expense.getAmount());
        }

        BigDecimal limit = budget.getMonthlyLimit();

        double percentage = total.divide(limit, 2, BigDecimal.ROUND_HALF_UP)
                .doubleValue() * 100;

        if (percentage >= 100) {

            mailService.sendMail(
                    user.getEmail(),
                    "Budget Exceeded",
                    "You have exceeded your budget for "
                            + category.getName());

        } else if (percentage >= 80) {

            mailService.sendMail(
                    user.getEmail(),
                    "Budget Warning",
                    "You have used "
                            + percentage
                            + "% of your budget for "
                            + category.getName());
        }
    }
}