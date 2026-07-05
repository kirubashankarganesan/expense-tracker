package com.expensetracker.controller;

import com.expensetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

        private final ReportService reportService;

        @GetMapping("/pdf")
        public ResponseEntity<byte[]> exportPdf(
                        Authentication authentication) {

                byte[] pdf = reportService.generateExpensePdf(
                                authentication.getName());

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=expense-report.pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(pdf);
        }

        @GetMapping("/excel")
        public ResponseEntity<byte[]> exportExcel(Authentication authentication) {

                byte[] excel = reportService.generateExpenseExcel(authentication.getName());

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=expense-report.xlsx")
                                .contentType(MediaType.parseMediaType(
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(excel);
        }
}
