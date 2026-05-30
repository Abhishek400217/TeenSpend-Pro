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
public class ExpenseDto {
    private Long id;
    private String title;
    private Double amount;
    private LocalDate date;
    private String category;
    private String priority;
    private String notes;
    private String tags;
    private Boolean isSubscription;
}
