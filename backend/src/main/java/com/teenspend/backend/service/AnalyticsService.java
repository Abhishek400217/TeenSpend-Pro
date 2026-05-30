package com.teenspend.backend.service;

import com.teenspend.backend.model.Expense;
import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final ExpenseRepository expenseRepository;

    public Map<String, Object> getAnalytics(User user) {
        List<Expense> expenses = expenseRepository.findByUserId(user.getId());
        
        double totalExpensesThisMonth = 0;
        double totalExpenses = 0;
        Map<String, Double> categoryBreakdown = new HashMap<>();
        Map<String, Double> monthlyTrend = new HashMap<>();

        int currentMonth = java.time.LocalDate.now().getMonthValue();
        int currentYear = java.time.LocalDate.now().getYear();

        for (Expense expense : expenses) {
            totalExpenses += expense.getAmount();
            
            if (expense.getDate().getMonthValue() == currentMonth && expense.getDate().getYear() == currentYear) {
                totalExpensesThisMonth += expense.getAmount();
            }

            // Category Breakdown
            categoryBreakdown.put(
                expense.getCategory(), 
                categoryBreakdown.getOrDefault(expense.getCategory(), 0.0) + expense.getAmount()
            );

            // Monthly Trend (Format: YYYY-MM)
            String monthKey = expense.getDate().getYear() + "-" + String.format("%02d", expense.getDate().getMonthValue());
            monthlyTrend.put(
                monthKey, 
                monthlyTrend.getOrDefault(monthKey, 0.0) + expense.getAmount()
            );
        }

        double remainingBudget = user.getMonthlyBudget() - totalExpensesThisMonth;
        double savings = remainingBudget > 0 ? remainingBudget : 0;
        double monthlyProgress = user.getMonthlyBudget() > 0 ? (totalExpensesThisMonth / user.getMonthlyBudget()) * 100 : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("totalExpensesThisMonth", totalExpensesThisMonth);
        result.put("totalExpenses", totalExpenses);
        result.put("remainingBudget", remainingBudget);
        result.put("savings", savings);
        result.put("monthlyProgress", Math.min(monthlyProgress, 100.0));
        result.put("categoryBreakdown", categoryBreakdown);
        result.put("monthlyTrend", monthlyTrend);
        result.put("monthlyBudget", user.getMonthlyBudget());

        return result;
    }
}
