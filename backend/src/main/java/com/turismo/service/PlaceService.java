package com.turismo.service;

import com.turismo.dto.PlaceDto;
import com.turismo.model.Place;
import com.turismo.model.Town;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final TownRepository townRepository;

    public PlaceDto createPlace(Long townId, PlaceDto dto) {

        Town town = townRepository.findById(townId)
                .orElseThrow(() -> new RuntimeException("Pueblo no encontrado"));

        Place place = Place.builder()
                .name(dto.getName())
                .description(dto.getDescription())
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
}