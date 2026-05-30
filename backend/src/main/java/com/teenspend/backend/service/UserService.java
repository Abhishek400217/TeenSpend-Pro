package com.teenspend.backend.service;

import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final GoalRepository goalRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final VerificationOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    public void changePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(User user, Map<String, String> payload) {
        // payload can optionally contain reason, logging it is possible if needed.
        // String reason = payload.get("reason");
        
        Long userId = user.getId();
        
        // Delete all related records
        expenseRepository.findByUserId(userId).forEach(expenseRepository::delete);
        goalRepository.findByUserId(userId).forEach(goalRepository::delete);
        subscriptionRepository.findByUserId(userId).forEach(subscriptionRepository::delete);
        
        // Delete OTPs related to this email
        otpRepository.deleteByEmail(user.getEmail());
        
        // Finally, delete the user
        userRepository.delete(user);
    }
}
