package com.teenspend.backend.controller;

import com.teenspend.backend.dto.ExpenseDto;
import com.teenspend.backend.model.User;
import com.teenspend.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService service;

    @PostMapping
    public ResponseEntity<ExpenseDto> addExpense(
            @RequestBody ExpenseDto dto,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(service.addExpense(dto, user));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getExpenses(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(service.getUserExpenses(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        service.deleteExpense(id, user);
        return ResponseEntity.ok().build();
    }
}
