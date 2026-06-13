package com.turismo.dto;

import com.turismo.model.Place;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDto {
    private Long id;
    private String name;
    private String description;
    private String nameEn;
    private String descriptionEn;
    private String category;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;

    private Long townId;
    private String townSlug;
    private String townName;
    private Double averageRating;
    private Long reviewCount;

    public static PlaceDto from(Place place) {
        return PlaceDto.builder()
                .id(place.getId())
                .name(place.getName())
                .description(place.getDescription())
                .nameEn(place.getNameEn())
                .descriptionEn(place.getDescriptionEn())
                .category(place.getCategory().name())
                .address(place.getAddress())
                .imageUrl(place.getImageUrl())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .createdAt(place.getCreatedAt())
                .build();
    }
}
