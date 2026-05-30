package com.teenspend.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import javax.mail.internet.MimeMessage;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    public void sendOtpEmail(String to, String otp, String purpose) {
    try {

        if (senderEmail == null || senderEmail.isBlank()) {
            throw new RuntimeException("SMTP credentials missing");
        }

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);

        helper.setTo(to);

        helper.setSubject("TeenSpend Pro - Email Verification");

        String html =
                "<h2>Your OTP</h2>"
                + "<h1>" + otp + "</h1>"
                + "<p>Expires in 5 minutes.</p>";

        helper.setText(html, true);

        mailSender.send(message);

        log.info("OTP sent to {}", to);

    }

    catch (Exception e) {

        log.error("SMTP ERROR", e);

       throw new RuntimeException(
                    "Failed to send OTP email"
            );
    }
}
}
