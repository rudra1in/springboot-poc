package com.gamex.sport;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SportRepository extends JpaRepository<Sport, UUID> {

    Optional<Sport> findByNameIgnoreCase(String name);

    Page<Sport> findByStatus(SportStatus status, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);
}
