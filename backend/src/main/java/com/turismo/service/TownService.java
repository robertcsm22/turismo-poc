package com.turismo.service;

import com.turismo.dto.PlaceDto;
import com.turismo.dto.TownDto;
import com.turismo.model.Town;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TownService {

    private final TownRepository townRepository;
    private final PlaceRepository placeRepository;

    public TownDto getTownBySlug(String slug) {
        Town town = townRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Pueblo no encontrado: " + slug));
        return TownDto.from(town);
    }

    public TownDto getTownById(Long id) {
        Town town = townRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pueblo no encontrado: " + id));
        return TownDto.from(town);
    }

    public List<PlaceDto> getPlacesByTownSlug(String slug) {
        return placeRepository.findByTownSlugAndActiveTrue(slug)
                .stream()
                .map(PlaceDto::from)
                .collect(Collectors.toList());
    }

    public List<PlaceDto> getPlacesByTownId(Long townId) {
        return placeRepository.findByTownIdAndActiveTrue(townId)
                .stream()
                .map(PlaceDto::from)
                .collect(Collectors.toList());
    }
}
