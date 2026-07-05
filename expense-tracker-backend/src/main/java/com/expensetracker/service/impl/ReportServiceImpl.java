package com.expensetracker.service.impl;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public byte[] generateExpensePdf(String email) {
        List<Expense> expenses = findExpenses(email);

        try (
                PDDocument document = new PDDocument();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);

            content.beginText();
            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
            content.newLineAtOffset(50, 750);
            content.showText("Expense Report");
            content.endText();

            float y = 720;

            for (Expense expense : expenses) {
                content.beginText();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                content.newLineAtOffset(50, y);
                content.showText(toReportLine(expense));
                content.endText();

                y -= 20;

                if (y < 60) {
                    content.close();
                    page = new PDPage();
                    document.addPage(page);
                    content = new PDPageContentStream(document, page);
                    y = 750;
                }
            }

            content.close();
            document.save(outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public byte[] generateExpenseExcel(String email) {
        List<Expense> expenses = findExpenses(email);

        try (
                XSSFWorkbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Expenses");
            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("Date");
            header.createCell(1).setCellValue("Category");
            header.createCell(2).setCellValue("Amount");
            header.createCell(3).setCellValue("Description");
            header.createCell(4).setCellValue("Recurring");

            for (int index = 0; index < expenses.size(); index++) {
                Expense expense = expenses.get(index);
                Row row = sheet.createRow(index + 1);

                row.createCell(0).setCellValue(expense.getExpenseDate().toString());
                row.createCell(1).setCellValue(expense.getCategory().getName());
                row.createCell(2).setCellValue(expense.getAmount().doubleValue());
                row.createCell(3).setCellValue(safeText(expense.getDescription()));
                row.createCell(4).setCellValue(expense.isRecurring() ? "Yes" : "No");
            }

            for (int column = 0; column < 5; column++) {
                sheet.autoSizeColumn(column);
            }

            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private List<Expense> findExpenses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return expenseRepository.findByUser(user);
    }

    private String toReportLine(Expense expense) {
        return expense.getExpenseDate()
                + " | "
                + expense.getCategory().getName()
                + " | INR "
                + expense.getAmount()
                + " | "
                + safeText(expense.getDescription());
    }

    private String safeText(String value) {
        return value == null ? "" : value;
    }
}
