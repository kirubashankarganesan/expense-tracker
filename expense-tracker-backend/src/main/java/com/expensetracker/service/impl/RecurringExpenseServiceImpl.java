package com.expensetracker.service.impl;

import com.expensetracker.dto.RecurringExpenseRequest;
import com.expensetracker.dto.RecurringExpenseResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.RecurringExpense;
import com.expensetracker.entity.User;
import com.expensetracker.enums.Frequency;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.RecurringExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.RecurringExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecurringExpenseServiceImpl implements RecurringExpenseService {

    private final CategoryRepository categoryRepository;
    private final RecurringExpenseRepository recurringExpenseRepository;
    private final UserRepository userRepository;

    @Override
    public RecurringExpenseResponse create(RecurringExpenseRequest request, String email) {
        User user = findUser(email);
        Category category = findCategoryForUser(request.getCategoryId(), user);

        RecurringExpense recurringExpense = RecurringExpense.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .frequency(normalizeFrequency(request.getFrequency()))
                .nextDueDate(request.getNextDueDate())
                .active(true)
                .category(category)
                .user(user)
                .build();

        return toResponse(recurringExpenseRepository.save(recurringExpense));
    }

    @Override
    public List<RecurringExpenseResponse> getAll(String email) {
        User user = findUser(email);

        return recurringExpenseRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public RecurringExpenseResponse update(
            Long id,
            RecurringExpenseRequest request,
            String email) {

        User user = findUser(email);
        RecurringExpense recurringExpense = findRecurringForUser(id, user);
        Category category = findCategoryForUser(request.getCategoryId(), user);

        recurringExpense.setAmount(request.getAmount());
        recurringExpense.setDescription(request.getDescription());
        recurringExpense.setFrequency(normalizeFrequency(request.getFrequency()));
        recurringExpense.setNextDueDate(request.getNextDueDate());
        recurringExpense.setCategory(category);

        return toResponse(recurringExpenseRepository.save(recurringExpense));
    }

    @Override
    public RecurringExpenseResponse toggleActive(Long id, String email) {
        User user = findUser(email);
        RecurringExpense recurringExpense = findRecurringForUser(id, user);
        recurringExpense.setActive(!recurringExpense.isActive());

        return toResponse(recurringExpenseRepository.save(recurringExpense));
    }

    @Override
    public void delete(Long id, String email) {
        User user = findUser(email);
        RecurringExpense recurringExpense = findRecurringForUser(id, user);
        recurringExpenseRepository.delete(recurringExpense);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Category findCategoryForUser(Long categoryId, User user) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Category not found");
        }

        return category;
    }

    private RecurringExpense findRecurringForUser(Long id, User user) {
        return recurringExpenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring expense not found"));
    }

    private String normalizeFrequency(String frequency) {
        return Frequency.valueOf(frequency.toUpperCase()).name();
    }

    private RecurringExpenseResponse toResponse(RecurringExpense recurringExpense) {
        return new RecurringExpenseResponse(
                recurringExpense.getId(),
                recurringExpense.getCategory().getName(),
                recurringExpense.getAmount(),
                recurringExpense.getDescription(),
                recurringExpense.getFrequency(),
                recurringExpense.getNextDueDate(),
                recurringExpense.isActive());
    }
}
