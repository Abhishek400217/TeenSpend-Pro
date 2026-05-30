package com.teenspend.backend.controller;

import com.teenspend.backend.dto.GoalDto;
import com.teenspend.backend.model.User;
import com.teenspend.backend.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<GoalDto>> getGoals(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getUserGoals(user));
    }

    @PostMapping
    public ResponseEntity<GoalDto> addGoal(@RequestBody GoalDto dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.addGoal(dto, user));
    }

    @PatchMapping("/{id}/add-funds")
    public ResponseEntity<GoalDto> addAmountToGoal(@PathVariable Long id, @RequestBody Map<String, Object> payload, @AuthenticationPrincipal User user) {
        Double amount = Double.valueOf(payload.get("amount").toString());
        return ResponseEntity.ok(goalService.updateGoalAmount(id, amount, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id, @AuthenticationPrincipal User user) {
        goalService.deleteGoal(id, user);
        return ResponseEntity.noContent().build();
    }
}
