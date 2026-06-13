package com.turismo.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDto {

    private Long id;

    private Long placeId;

    private Integer rating;

    private String comment;

    private String userName;

    private LocalDateTime createdAt;
}