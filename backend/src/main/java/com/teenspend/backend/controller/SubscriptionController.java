package com.teenspend.backend.controller;

import com.teenspend.backend.dto.SubscriptionDto;
import com.teenspend.backend.model.User;
import com.teenspend.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService service;

    @GetMapping
    public ResponseEntity<List<SubscriptionDto>> getSubscriptions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getUserSubscriptions(user));
    }

    @PostMapping
    public ResponseEntity<SubscriptionDto> addSubscription(@RequestBody SubscriptionDto dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.addSubscription(dto, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id, @AuthenticationPrincipal User user) {
        service.deleteSubscription(id, user);
        return ResponseEntity.noContent().build();
    }
}
