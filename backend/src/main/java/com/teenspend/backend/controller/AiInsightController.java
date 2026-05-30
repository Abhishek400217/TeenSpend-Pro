package com.teenspend.backend.controller;

import com.teenspend.backend.model.User;
import com.teenspend.backend.service.AiInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insights")
@RequiredArgsConstructor
public class AiInsightController {

    private final AiInsightService aiInsightService;

    @GetMapping
    public ResponseEntity<List<String>> getInsights(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiInsightService.generateInsights(user));
    }
}
