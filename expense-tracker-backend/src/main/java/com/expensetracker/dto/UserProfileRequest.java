package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;
}
