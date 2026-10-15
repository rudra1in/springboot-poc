package com.gamex.sport.dto;

import com.gamex.sport.SportStatus;
import com.gamex.sport.SportType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SportRequest(

        @NotBlank(message = "Sport name is required")
        @Size(max = 100, message = "Sport name must not exceed 100 characters")
        String name,

        @NotNull(message = "Sport type is required")
        SportType sportType,

        @NotNull(message = "Status is required")
        SportStatus status,

        @Size(max = 2000, message = "Description must not exceed 2000 characters")
        String description,

        @NotNull(message = "Players per team is required")
        @Min(value = 1, message = "Players per team must be at least 1")
        Integer playersPerTeam,

        @Min(value = 0, message = "Number of referees cannot be negative")
        Integer numberOfReferees,

        @Min(value = 0, message = "Number of scorers cannot be negative")
        Integer numberOfScorers
) {}
