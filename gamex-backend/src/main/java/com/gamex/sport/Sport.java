package com.gamex.sport;

import com.gamex.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "sports")
public class Sport extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "sport_type", length = 50)
    private SportType sportType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SportStatus status = SportStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "players_per_team")
    private Integer playersPerTeam;

    @Column(name = "referees_per_match")
    private Integer refereesPerMatch;

    @Column(name = "scorers_per_match")
    private Integer scorersPerMatch;

    // --- Getters ---
    public String getName() { return name; }
    public SportType getSportType() { return sportType; }
    public SportStatus getStatus() { return status; }
    public String getDescription() { return description; }
    public Integer getPlayersPerTeam() { return playersPerTeam; }
    public Integer getRefereesPerMatch() { return refereesPerMatch; }
    public Integer getScorersPerMatch() { return scorersPerMatch; }

    // --- Setters ---
    public void setName(String name) { this.name = name; }
    public void setSportType(SportType sportType) { this.sportType = sportType; }
    public void setStatus(SportStatus status) { this.status = status; }
    public void setDescription(String description) { this.description = description; }
    public void setPlayersPerTeam(Integer playersPerTeam) { this.playersPerTeam = playersPerTeam; }
    public void setRefereesPerMatch(Integer refereesPerMatch) { this.refereesPerMatch = refereesPerMatch; }
    public void setScorersPerMatch(Integer scorersPerMatch) { this.scorersPerMatch = scorersPerMatch; }
}
