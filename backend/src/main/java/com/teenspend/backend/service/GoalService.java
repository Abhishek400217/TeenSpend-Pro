package com.teenspend.backend.service;

import com.teenspend.backend.dto.GoalDto;
import com.teenspend.backend.model.Goal;
import com.teenspend.backend.model.User;
import com.teenspend.backend.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalDto addGoal(GoalDto dto, User user) {
        Goal goal = Goal.builder()
                .userId(user.getId())
                .name(dto.getName())
                .targetAmount(dto.getTargetAmount())
                .currentAmount(dto.getCurrentAmount() != null ? dto.getCurrentAmount() : 0.0)
                .deadline(dto.getDeadline())
                .icon(dto.getIcon())
                .status("ACTIVE")
                .build();
        Goal saved = goalRepository.save(goal);
        return mapToDto(saved);
    }

    public List<GoalDto> getUserGoals(User user) {
        return goalRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public GoalDto updateGoalAmount(Long id, Double amountToAdd, User user) {
        Goal goal = goalRepository.findById(id).orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this goal");
        }
        goal.setCurrentAmount(goal.getCurrentAmount() + amountToAdd);
        if (goal.getCurrentAmount() >= goal.getTargetAmount()) {
            goal.setStatus("COMPLETED");
        }
        return mapToDto(goalRepository.save(goal));
    }

    public void deleteGoal(Long id, User user) {
        Goal goal = goalRepository.findById(id).orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }
        goalRepository.delete(goal);
    }

    private GoalDto mapToDto(Goal goal) {
        return GoalDto.builder()
                .id(goal.getId())
                .name(goal.getName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .deadline(goal.getDeadline())
                .icon(goal.getIcon())
                .status(goal.getStatus())
                .build();
    }
}
