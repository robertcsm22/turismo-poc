package com.turismo.service;

import com.turismo.dto.ReviewDto;
import com.turismo.model.Place;
import com.turismo.model.Review;
import com.turismo.model.User;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.ReviewRepository;
import com.turismo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;

    public ReviewDto createReview(Long placeId, Long userId, ReviewDto dto) {

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Review review = Review.builder()
                .rating(dto.getRating())
                .comment(dto.getComment())
                .place(place)
                .user(user)
                .build();

        Review saved = reviewRepository.save(review);

        return ReviewDto.builder()
                .id(saved.getId())
                .placeId(place.getId())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .userName(user.getName())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public List<ReviewDto> getReviewsByPlace(Long placeId) {

        return reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId)
                .stream()
                .map(review -> ReviewDto.builder()
                        .id(review.getId())
                        .placeId(review.getPlace().getId())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .userName(review.getUser().getName())
                        .createdAt(review.getCreatedAt())
                        .build())
                .toList();
    }
}