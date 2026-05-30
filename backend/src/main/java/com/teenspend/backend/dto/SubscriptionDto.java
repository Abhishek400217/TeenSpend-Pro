package com.teenspend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionDto {
    private Long id;
    private String name;
    private Double cost;
    private String billingCycle;
    private String category;
    private LocalDate nextBillingDate;
}
