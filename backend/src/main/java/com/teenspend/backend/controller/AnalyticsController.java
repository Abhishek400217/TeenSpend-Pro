package com.teenspend.backend.controller;

import com.teenspend.backend.model.User;
import com.teenspend.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(service.getAnalytics(user));
    }
}
