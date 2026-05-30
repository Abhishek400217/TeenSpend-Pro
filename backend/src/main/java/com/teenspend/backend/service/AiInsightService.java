package com.teenspend.backend.service;

import com.teenspend.backend.model.Expense;
import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiInsightService {

    private final ExpenseRepository expenseRepository;

    public List<String> generateInsights(User user) {
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());
        List<String> insights = new ArrayList<>();

        if (expenses.isEmpty()) {
            insights.add("Add your first expense to unlock smart insights!");
            return insights;
        }

        double totalSpent = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double budget = user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 0;

        if (budget > 0) {
            double percentage = (totalSpent / budget) * 100;
            if (percentage > 90) {
                insights.add("⚠️ You're very close to exceeding your monthly budget.");
            } else if (percentage < 50) {
                insights.add("🎉 Great job! You have spent less than half of your budget.");
            }
        }

        // Category breakdown
        Map<String, Double> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));

        categoryTotals.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(entry -> insights.add("💡 You spend the most on " + entry.getKey() + ". Consider finding ways to save here."));

        // Gamification insight
        if (user.getLevel() != null && user.getLevel() > 1) {
            insights.add("⭐ You are a Level " + user.getLevel() + " saver! Keep tracking to level up.");
        }

        insights.add("📈 Try to allocate 20% of your budget towards your saving goals.");

        return insights;
    }
}
