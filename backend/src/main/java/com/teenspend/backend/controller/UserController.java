package com.teenspend.backend.controller;

import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.teenspend.backend.service.UserService;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {
        // Exclude password in response by ideally using a DTO, but for speed, 
        // we could just set it null here or use @JsonIgnore on the model.
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/onboard")
    public ResponseEntity<User> completeOnboarding(@RequestBody Map<String, Object> payload, @AuthenticationPrincipal User user) {
        if (payload.containsKey("monthlyBudget")) {
            user.setMonthlyBudget(Double.valueOf(payload.get("monthlyBudget").toString()));
        }
        if (payload.containsKey("income")) {
            user.setIncome(Double.valueOf(payload.get("income").toString()));
        }
        if (payload.containsKey("studentStatus")) {
            user.setStudentStatus(payload.get("studentStatus").toString());
        }
        if (payload.containsKey("savingGoal")) {
            user.setSavingGoal(Double.valueOf(payload.get("savingGoal").toString()));
        }
        if (payload.containsKey("primaryCategory")) {
            user.setPrimaryCategory(payload.get("primaryCategory").toString());
        }
        user.setOnboarded(true);
        User updated = userRepository.save(user);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/theme")
    public ResponseEntity<User> updateTheme(@RequestBody Map<String, String> payload, @AuthenticationPrincipal User user) {
        user.setThemePreference(payload.get("theme"));
        User updated = userRepository.save(user);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload, @AuthenticationPrincipal User user) {
        try {
            userService.changePassword(user, payload.get("oldPassword"), payload.get("newPassword"));
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(@RequestBody Map<String, String> payload, @AuthenticationPrincipal User user) {
        try {
            userService.deleteAccount(user, payload);
            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
