package com.teenspend.backend.service;

import com.teenspend.backend.config.JwtService;
import com.teenspend.backend.dto.AuthenticationRequest;
import com.teenspend.backend.dto.AuthenticationResponse;
import com.teenspend.backend.dto.RegisterRequest;
import com.teenspend.backend.model.User;
import com.teenspend.backend.model.VerificationOtp;
import com.teenspend.backend.repository.UserRepository;
import com.teenspend.backend.repository.VerificationOtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final VerificationOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public void sendOtp(String email, VerificationOtp.Purpose purpose) {
        if (purpose == VerificationOtp.Purpose.REGISTER && repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (purpose == VerificationOtp.Purpose.RESET_PASSWORD && repository.findByEmail(email).isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Delete any existing OTP for this email and purpose
        otpRepository.deleteByEmailAndPurpose(email, purpose);

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        
        VerificationOtp otp = VerificationOtp.builder()
                .email(email)
                .otp(otpCode)
                .purpose(purpose)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();
                
        otpRepository.save(otp);
        emailService.sendOtpEmail(email, otpCode, purpose.name());
    }

    public boolean verifyOtp(String email, String otpCode, VerificationOtp.Purpose purpose) {
        VerificationOtp otp = otpRepository.findByEmailAndPurposeAndOtp(email, purpose, otpCode)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otp.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        return true;
    }

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        // Verify OTP first
        verifyOtp(request.getEmail(), request.getOtp(), VerificationOtp.Purpose.REGISTER);

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .monthlyBudget(request.getMonthlyBudget() != null ? request.getMonthlyBudget() : 0.0)
                .build();
        repository.save(user);
        
        // Delete OTP after successful registration
        otpRepository.deleteByEmailAndPurpose(request.getEmail(), VerificationOtp.Purpose.REGISTER);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .monthlyBudget(user.getMonthlyBudget())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .monthlyBudget(user.getMonthlyBudget())
                .build();
    }

    @Transactional
    public void resetPassword(String email, String otpCode, String newPassword) {
        verifyOtp(email, otpCode, VerificationOtp.Purpose.RESET_PASSWORD);
        
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
        
        otpRepository.deleteByEmailAndPurpose(email, VerificationOtp.Purpose.RESET_PASSWORD);
    }
}
