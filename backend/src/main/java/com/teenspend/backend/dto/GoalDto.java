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
public class GoalDto {
    private Long id;
    private String name;
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate deadline;
    private String icon;
    private String status;
}
