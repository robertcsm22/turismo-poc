package com.turismo.controller;

import com.turismo.dto.ReviewDto;
import com.turismo.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByPlace(
            @PathVariable Long placeId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByPlace(placeId)
        );
    }

    @PostMapping("/place/{placeId}/user/{userId}")
    public ResponseEntity<ReviewDto> createReview(
            @PathVariable Long placeId,
            @PathVariable Long userId,
            @RequestBody ReviewDto reviewDto) {

        return ResponseEntity.ok(
                reviewService.createReview(placeId, userId, reviewDto)
        );
    }
}
