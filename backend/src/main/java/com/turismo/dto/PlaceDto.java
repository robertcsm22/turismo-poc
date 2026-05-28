package com.turismo.dto;

import com.turismo.model.Place;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;

    public static PlaceDto from(Place place) {
        return PlaceDto.builder()
                .id(place.getId())
                .name(place.getName())
                .description(place.getDescription())
                .category(place.getCategory().name())
                .address(place.getAddress())
                .imageUrl(place.getImageUrl())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .build();
    }
}
