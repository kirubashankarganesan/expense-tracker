package com.expensetracker.service;

import com.expensetracker.dto.RecurringExpenseRequest;
import com.expensetracker.dto.RecurringExpenseResponse;

import java.util.List;

public interface RecurringExpenseService {

        RecurringExpenseResponse create(
                        RecurringExpenseRequest request,
                        String email);

        List<RecurringExpenseResponse> getAll(String email);

        RecurringExpenseResponse update(
                        Long id,
                        RecurringExpenseRequest request,
                        String email);

        RecurringExpenseResponse toggleActive(Long id, String email);

        void delete(Long id, String email);
}
