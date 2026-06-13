package com.turismo.service;

import com.turismo.dto.ReviewDto;
import com.turismo.model.Place;
import com.turismo.model.Review;
import com.turismo.model.Town;
import com.turismo.model.User;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.ReviewRepository;
import com.turismo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Place place;
    private User user;

    @BeforeEach
    void setUp() {
        Town town = Town.builder().id(1L).slug("santa-teresa").name("Santa Teresa").build();
        place = Place.builder().id(1L).name("Playa Carmen").category(Place.Category.PLAYA).town(town).build();
        user = User.builder().id(1L).email("turista@gmail.com").name("Turista").build();
    }

    @Test
    void createReview_savesAndReturnsDto() {
        when(placeRepository.findById(1L)).thenReturn(Optional.of(place));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> {
            Review r = inv.getArgument(0);
            r.setId(10L);
            r.setCreatedAt(LocalDateTime.of(2026, 6, 1, 12, 0));
            return r;
        });

        ReviewDto dto = ReviewDto.builder().rating(5).comment("Excelente lugar").build();

        ReviewDto result = reviewService.createReview(1L, 1L, dto);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getPlaceId()).isEqualTo(1L);
        assertThat(result.getRating()).isEqualTo(5);
        assertThat(result.getComment()).isEqualTo("Excelente lugar");
        assertThat(result.getUserName()).isEqualTo("Turista");
        assertThat(result.getCreatedAt()).isEqualTo(LocalDateTime.of(2026, 6, 1, 12, 0));
    }

    @Test
    void createReview_throwsWhenPlaceNotFound() {
        when(placeRepository.findById(99L)).thenReturn(Optional.empty());

        ReviewDto dto = ReviewDto.builder().rating(5).comment("Excelente lugar").build();

        assertThatThrownBy(() -> reviewService.createReview(99L, 1L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Lugar no encontrado");
    }

    @Test
    void createReview_throwsWhenUserNotFound() {
        when(placeRepository.findById(1L)).thenReturn(Optional.of(place));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ReviewDto dto = ReviewDto.builder().rating(5).comment("Excelente lugar").build();

        assertThatThrownBy(() -> reviewService.createReview(1L, 99L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Usuario no encontrado");
    }

    @Test
    void getReviewsByPlace_returnsMappedDtos() {
        Review review = Review.builder()
                .id(1L)
                .rating(4)
                .comment("Muy bonito")
                .place(place)
                .user(user)
                .createdAt(LocalDateTime.of(2026, 5, 20, 10, 0))
                .build();

        when(reviewRepository.findByPlaceIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(review));

        List<ReviewDto> result = reviewService.getReviewsByPlace(1L);

        assertThat(result).hasSize(1);
        ReviewDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getPlaceId()).isEqualTo(1L);
        assertThat(dto.getRating()).isEqualTo(4);
        assertThat(dto.getComment()).isEqualTo("Muy bonito");
        assertThat(dto.getUserName()).isEqualTo("Turista");
        assertThat(dto.getCreatedAt()).isEqualTo(LocalDateTime.of(2026, 5, 20, 10, 0));
    }

    @Test
    void getReviewsByPlace_returnsEmptyListWhenNoReviews() {
        when(reviewRepository.findByPlaceIdOrderByCreatedAtDesc(2L)).thenReturn(List.of());

        List<ReviewDto> result = reviewService.getReviewsByPlace(2L);

        assertThat(result).isEmpty();
    }
}
