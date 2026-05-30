package com.teenspend.backend.repository;

import com.teenspend.backend.model.VerificationOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationOtpRepository extends JpaRepository<VerificationOtp, Long> {
    Optional<VerificationOtp> findByEmailAndPurposeAndOtp(String email, VerificationOtp.Purpose purpose, String otp);
    void deleteByEmailAndPurpose(String email, VerificationOtp.Purpose purpose);
    void deleteByEmail(String email);
}
