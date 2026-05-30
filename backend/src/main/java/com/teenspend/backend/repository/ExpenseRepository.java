package com.teenspend.backend.repository;

import com.teenspend.backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdOrderByDateDesc(Long userId);
}
