package com.expensetracker.service;

public interface ReportService {

    byte[] generateExpensePdf(String email);

    byte[] generateExpenseExcel(String email);
}
