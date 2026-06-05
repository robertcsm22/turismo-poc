package com.turismo.repository;

import com.turismo.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByTownIdAndActiveTrue(Long townId);
    List<Place> findByTownSlugAndActiveTrue(String townSlug);
    List<Place> findByActiveTrue();
}
