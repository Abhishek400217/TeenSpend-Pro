package com.teenspend.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.teenspend.backend.model.Expense;
import com.teenspend.backend.model.Goal;
import com.teenspend.backend.model.Subscription;
import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.ExpenseRepository;
import com.teenspend.backend.repository.GoalRepository;
import com.teenspend.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PdfExportService {

    private final ExpenseRepository expenseRepository;
    private final GoalRepository goalRepository;
    private final SubscriptionRepository subscriptionRepository;

    public byte[] generatePdfReport(User user) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BaseColor.BLACK);
            Paragraph title = new Paragraph("TeenSpend Financial Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Profile Section
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.DARK_GRAY);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
            
            document.add(new Paragraph("Profile Overview", headerFont));
            document.add(new Paragraph("Name: " + user.getFullName(), normalFont));
            document.add(new Paragraph("Email: " + user.getEmail(), normalFont));
            document.add(new Paragraph("Monthly Budget: ₹" + (user.getMonthlyBudget() != null ? user.getMonthlyBudget() : "N/A"), normalFont));
            document.add(new Paragraph("Financial Score: " + user.getFinancialScore(), normalFont));
            document.add(new Paragraph(" "));

            // Expenses Section
            List<Expense> expenses = expenseRepository.findByUserId(user.getId());
            document.add(new Paragraph("Recent Expenses", headerFont));
            document.add(new Paragraph(" "));
            
            PdfPTable expenseTable = new PdfPTable(4);
            expenseTable.setWidthPercentage(100);
            expenseTable.addCell(new PdfPCell(new Phrase("Date", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            expenseTable.addCell(new PdfPCell(new Phrase("Title", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            expenseTable.addCell(new PdfPCell(new Phrase("Category", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            expenseTable.addCell(new PdfPCell(new Phrase("Amount (₹)", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            
            for (Expense e : expenses.stream().limit(20).collect(Collectors.toList())) {
                expenseTable.addCell(e.getDate().toString());
                expenseTable.addCell(e.getTitle());
                expenseTable.addCell(e.getCategory());
                expenseTable.addCell(String.valueOf(e.getAmount()));
            }
            document.add(expenseTable);
            document.add(new Paragraph(" "));

            // Goals Section
            List<Goal> goals = goalRepository.findByUserId(user.getId());
            document.add(new Paragraph("Savings Goals", headerFont));
            document.add(new Paragraph(" "));
            
            PdfPTable goalTable = new PdfPTable(4);
            goalTable.setWidthPercentage(100);
            goalTable.addCell(new PdfPCell(new Phrase("Name", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            goalTable.addCell(new PdfPCell(new Phrase("Target (₹)", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            goalTable.addCell(new PdfPCell(new Phrase("Current (₹)", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            goalTable.addCell(new PdfPCell(new Phrase("Status", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            
            for (Goal g : goals) {
                goalTable.addCell(g.getName());
                goalTable.addCell(String.valueOf(g.getTargetAmount()));
                goalTable.addCell(String.valueOf(g.getCurrentAmount()));
                goalTable.addCell(g.getStatus() != null ? g.getStatus() : "ACTIVE");
            }
            document.add(goalTable);
            document.add(new Paragraph(" "));

            // Subscriptions Section
            List<Subscription> subscriptions = subscriptionRepository.findByUserId(user.getId());
            document.add(new Paragraph("Active Subscriptions", headerFont));
            document.add(new Paragraph(" "));
            
            PdfPTable subTable = new PdfPTable(3);
            subTable.setWidthPercentage(100);
            subTable.addCell(new PdfPCell(new Phrase("Name", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            subTable.addCell(new PdfPCell(new Phrase("Cost (₹)", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            subTable.addCell(new PdfPCell(new Phrase("Billing Cycle", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            
            for (Subscription s : subscriptions) {
                subTable.addCell(s.getName());
                subTable.addCell(String.valueOf(s.getCost()));
                subTable.addCell(s.getBillingCycle());
            }
            document.add(subTable);

            // Generation Date
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Report generated on: " + LocalDate.now(), FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY)));

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}
