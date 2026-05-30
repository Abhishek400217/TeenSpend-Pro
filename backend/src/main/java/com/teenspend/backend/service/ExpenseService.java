package com.teenspend.backend.service;

import com.teenspend.backend.dto.ExpenseDto;
import com.teenspend.backend.model.Expense;
import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.ExpenseRepository;
import com.teenspend.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository repository;
    private final UserRepository userRepository;

    public ExpenseDto addExpense(ExpenseDto dto, User user) {
        Expense expense = Expense.builder()
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .notes(dto.getNotes())
                .tags(dto.getTags())
                .isSubscription(dto.getIsSubscription() != null ? dto.getIsSubscription() : false)
                .user(user)
                .build();
        Expense saved = repository.save(expense);
        
        // Gamification: Add XP for logging an expense
        user.setXp((user.getXp() == null ? 0 : user.getXp()) + 10);
        if (user.getXp() >= 100) {
            user.setLevel((user.getLevel() == null ? 1 : user.getLevel()) + 1);
            user.setXp(0);
        }
        // Very basic financial score logic (mock)
        user.setFinancialScore((user.getFinancialScore() == null ? 100.0 : user.getFinancialScore()) + 0.5);
        userRepository.save(user);

        return mapToDto(saved);
    }

    public List<ExpenseDto> getUserExpenses(User user) {
        return repository.findByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteExpense(Long id, User user) {
        Expense expense = repository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this expense");
        }
        repository.delete(expense);
    }

    private ExpenseDto mapToDto(Expense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .date(expense.getDate())
                .category(expense.getCategory())
                .priority(expense.getPriority())
                .notes(expense.getNotes())
                .tags(expense.getTags())
                .isSubscription(expense.getIsSubscription())
                .build();
    }
}
