package com.expensetracker.scheduler;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.RecurringExpense;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.RecurringExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class RecurringExpenseScheduler {

    private final ExpenseRepository expenseRepository;
    private final RecurringExpenseRepository recurringExpenseRepository;

    @Scheduled(cron = "0 5 0 * * *")
    public void processDueRecurringExpenses() {
        LocalDate today = LocalDate.now();

        recurringExpenseRepository.findByActiveTrueAndNextDueDateLessThanEqual(today)
                .forEach(recurringExpense -> {
                    expenseRepository.save(Expense.builder()
                            .amount(recurringExpense.getAmount())
                            .description(recurringExpense.getDescription())
                            .expenseDate(today)
                            .recurring(true)
                            .category(recurringExpense.getCategory())
                            .user(recurringExpense.getUser())
                            .build());

                    recurringExpense.setNextDueDate(nextDueDate(recurringExpense, today));
                    recurringExpenseRepository.save(recurringExpense);
                });
    }

    private LocalDate nextDueDate(RecurringExpense recurringExpense, LocalDate fromDate) {
        return switch (recurringExpense.getFrequency()) {
            case "DAILY" -> fromDate.plusDays(1);
            case "WEEKLY" -> fromDate.plusWeeks(1);
            case "YEARLY" -> fromDate.plusYears(1);
            default -> fromDate.plusMonths(1);
        };
    }
}
