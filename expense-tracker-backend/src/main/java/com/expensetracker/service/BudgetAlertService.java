package com.expensetracker.service;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;

public interface BudgetAlertService {

    void checkBudget(User user, Category category);

}