package com.turismo.service;

import com.turismo.dto.PlaceDto;
import com.turismo.model.Place;
import com.turismo.model.Town;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.ReviewRepository;
import com.turismo.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final TownRepository townRepository;
    private final ReviewRepository reviewRepository;

    public PlaceDto createPlace(Long townId, PlaceDto dto) {

        Town town = townRepository.findById(townId)
                .orElseThrow(() -> new RuntimeException("Pueblo no encontrado"));

        Place place = Place.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .nameEn(dto.getNameEn())
                .descriptionEn(dto.getDescriptionEn())
                .category(Place.Category.valueOf(dto.getCategory()))
                .address(dto.getAddress())
                .imageUrl(dto.getImageUrl())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .town(town)
                .build();

        return PlaceDto.from(placeRepository.save(place));
    }

    public PlaceDto updatePlace(Long id, PlaceDto dto) {

        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));

        place.setName(dto.getName());
        place.setDescription(dto.getDescription());
        place.setNameEn(dto.getNameEn());
        place.setDescriptionEn(dto.getDescriptionEn());
        place.setCategory(Place.Category.valueOf(dto.getCategory()));
        place.setAddress(dto.getAddress());
        place.setImageUrl(dto.getImageUrl());
        place.setLatitude(dto.getLatitude());
        place.setLongitude(dto.getLongitude());

        return PlaceDto.from(placeRepository.save(place));
    }

    public void deletePlace(Long id) {

    Place place = placeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));

    placeRepository.delete(place);
    }

    public List<PlaceDto> getAllActivePlacesWithStats() {
        return placeRepository.findByActiveTrue().stream()
                .map(place -> {
                    PlaceDto dto = PlaceDto.from(place);
                    Town town = place.getTown();
                    dto.setTownId(town.getId());
                    dto.setTownSlug(town.getSlug());
                    dto.setTownName(town.getName());
                    dto.setAverageRating(reviewRepository.findAverageRatingByPlaceId(place.getId()));
                    dto.setReviewCount(reviewRepository.countByPlaceId(place.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }
}