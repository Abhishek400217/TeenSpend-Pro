package com.teenspend.backend.service;

import com.teenspend.backend.dto.SubscriptionDto;
import com.teenspend.backend.model.Subscription;
import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository repository;

    public SubscriptionDto addSubscription(SubscriptionDto dto, User user) {
        Subscription subscription = Subscription.builder()
                .userId(user.getId())
                .name(dto.getName())
                .cost(dto.getCost())
                .billingCycle(dto.getBillingCycle())
                .category(dto.getCategory())
                .nextBillingDate(dto.getNextBillingDate())
                .build();
        return mapToDto(repository.save(subscription));
    }

    public List<SubscriptionDto> getUserSubscriptions(User user) {
        return repository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteSubscription(Long id, User user) {
        Subscription sub = repository.findById(id).orElseThrow(() -> new RuntimeException("Subscription not found"));
        if (!sub.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }
        repository.delete(sub);
    }

    private SubscriptionDto mapToDto(Subscription sub) {
        return SubscriptionDto.builder()
                .id(sub.getId())
                .name(sub.getName())
                .cost(sub.getCost())
                .billingCycle(sub.getBillingCycle())
                .category(sub.getCategory())
                .nextBillingDate(sub.getNextBillingDate())
                .build();
    }
}
