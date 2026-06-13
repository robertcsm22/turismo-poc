package com.turismo.repository;

import com.turismo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPlaceIdOrderByCreatedAtDesc(Long placeId);

    long countByPlaceId(Long placeId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.place.id = :placeId")
    Double findAverageRatingByPlaceId(@Param("placeId") Long placeId);
}