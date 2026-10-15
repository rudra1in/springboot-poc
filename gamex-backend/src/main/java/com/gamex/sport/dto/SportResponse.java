package com.gamex.sport.dto;

import com.gamex.sport.Sport;
import com.gamex.sport.SportStatus;
import com.gamex.sport.SportType;

import java.time.Instant;
import java.util.UUID;

public record SportResponse(
        UUID id,
        String name,
        SportType sportType,
        SportStatus status,
        String description,
        Integer playersPerTeam,
        Integer numberOfReferees,
        Integer numberOfScorers,
        Instant createdAt,
        Instant updatedAt
) {
    public static SportResponse from(Sport sport) {
        return new SportResponse(
                sport.getId(),
                sport.getName(),
                sport.getSportType(),
                sport.getStatus(),
                sport.getDescription(),
                sport.getPlayersPerTeam(),
                sport.getRefereesPerMatch(),
                sport.getScorersPerMatch(),
                sport.getCreatedAt(),
                sport.getUpdatedAt()
        );
    }
}
