package com.gamex.sport;

import com.gamex.common.DuplicateResourceException;
import com.gamex.common.ResourceNotFoundException;
import com.gamex.sport.dto.SportRequest;
import com.gamex.sport.dto.SportResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SportService {

    private final SportRepository sportRepository;

    @Transactional(readOnly = true)
    public Page<SportResponse> list(Pageable pageable) {
        return sportRepository.findAll(pageable).map(SportResponse::from);
    }

    @Transactional(readOnly = true)
    public SportResponse getById(UUID id) {
        return SportResponse.from(findOrThrow(id));
    }

    public SportResponse create(SportRequest request) {
        log.info("Creating sport: {}", request.name());
        if (sportRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException(
                    "Sport with name '%s' already exists. Code: GAMEX-4090".formatted(request.name()));
        }
        Sport sport = new Sport();
        mapRequestToEntity(request, sport);
        Sport saved = sportRepository.save(sport);
        log.info("Sport created with id: {}", saved.getId());
        return SportResponse.from(saved);
    }

    public SportResponse update(UUID id, SportRequest request) {
        log.info("Updating sport id: {}", id);
        Sport sport = findOrThrow(id);

        boolean nameChanged = !sport.getName().equalsIgnoreCase(request.name());
        if (nameChanged && sportRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException(
                    "Sport with name '%s' already exists. Code: GAMEX-4090".formatted(request.name()));
        }
        mapRequestToEntity(request, sport);
        return SportResponse.from(sportRepository.save(sport));
    }

    public void delete(UUID id) {
        log.info("Deleting sport id: {}", id);
        Sport sport = findOrThrow(id);
        sportRepository.delete(sport);
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private Sport findOrThrow(UUID id) {
        return sportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sport not found: %s. Code: GAMEX-4041".formatted(id)));
    }

    private void mapRequestToEntity(SportRequest req, Sport sport) {
        sport.setName(req.name());
        sport.setSportType(req.sportType());
        sport.setStatus(req.status());
        sport.setDescription(req.description());
        sport.setPlayersPerTeam(req.playersPerTeam());
        sport.setRefereesPerMatch(req.numberOfReferees());
        sport.setScorersPerMatch(req.numberOfScorers());
    }
}
