package com.turismo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turismo.dto.ReviewDto;
import com.turismo.repository.UserRepository;
import com.turismo.security.JwtTokenProvider;
import com.turismo.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewService reviewService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Test
    void getReviewsByPlace_returnsReviewList() throws Exception {
        ReviewDto dto = ReviewDto.builder()
                .id(1L)
                .placeId(1L)
                .rating(5)
                .comment("Excelente")
                .userName("Turista")
                .createdAt(LocalDateTime.of(2026, 6, 1, 12, 0))
                .build();

        when(reviewService.getReviewsByPlace(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/reviews/place/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].comment").value("Excelente"))
                .andExpect(jsonPath("$[0].userName").value("Turista"));
    }

    @Test
    void createReview_returnsCreatedReview() throws Exception {
        ReviewDto requestDto = ReviewDto.builder().rating(4).comment("Muy bonito").build();
        ReviewDto responseDto = ReviewDto.builder()
                .id(2L)
                .placeId(1L)
                .rating(4)
                .comment("Muy bonito")
                .userName("Turista")
                .createdAt(LocalDateTime.of(2026, 6, 1, 12, 0))
                .build();

        when(reviewService.createReview(eq(1L), eq(1L), any(ReviewDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/reviews/place/1/user/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.rating").value(4))
                .andExpect(jsonPath("$.userName").value("Turista"));
    }
}
