package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.expensetracker.entity.Category;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

        List<Expense> findByUser(User user);

        List<Expense> findByUserAndExpenseDateBetween(
                        User user,
                        LocalDate start,
                        LocalDate end);

        // Pagination
        Page<Expense> findByUser(User user, Pageable pageable);

        // Search by description
        Page<Expense> findByUserAndDescriptionContainingIgnoreCase(
                        User user,
                        String keyword,
                        Pageable pageable);

        // Filter by category
        Page<Expense> findByUserAndCategoryId(
                        User user,
                        Long categoryId,
                        Pageable pageable);

        // Filter by date
        Page<Expense> findByUserAndExpenseDateBetween(
                        User user,
                        LocalDate startDate,
                        LocalDate endDate,
                        Pageable pageable);

        List<Expense> findByUserAndCategory(User user, Category category);
}