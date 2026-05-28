package com.turismo.repository;

import com.turismo.model.Town;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TownRepository extends JpaRepository<Town, Long> {
    Optional<Town> findBySlugAndActiveTrue(String slug);
    Optional<Town> findBySlug(String slug);
}
