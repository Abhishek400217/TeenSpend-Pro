package com.teenspend.backend.controller;

import com.teenspend.backend.dto.AuthenticationRequest;
import com.teenspend.backend.dto.AuthenticationResponse;
import com.teenspend.backend.dto.OtpRequest;
import com.teenspend.backend.dto.RegisterRequest;
import com.teenspend.backend.model.VerificationOtp;
import com.teenspend.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/send-otp")
    public ResponseEntity<Void> sendOtp(@RequestBody OtpRequest request) {
        service.sendOtp(request.getEmail(), VerificationOtp.Purpose.REGISTER);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(@RequestBody OtpRequest request) {
        boolean isValid = service.verifyOtp(request.getEmail(), request.getOtp(), VerificationOtp.Purpose.REGISTER);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/forgot-password/send")
    public ResponseEntity<Void> forgotPasswordSend(@RequestBody OtpRequest request) {
        service.sendOtp(request.getEmail(), VerificationOtp.Purpose.RESET_PASSWORD);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<Boolean> forgotPasswordVerify(@RequestBody OtpRequest request) {
        boolean isValid = service.verifyOtp(request.getEmail(), request.getOtp(), VerificationOtp.Purpose.RESET_PASSWORD);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Void> forgotPasswordReset(@RequestBody OtpRequest request) {
        service.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
