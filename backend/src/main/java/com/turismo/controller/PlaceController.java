package com.turismo.controller;

import com.turismo.dto.PlaceDto;
import com.turismo.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping("/town/{townId}")
    public ResponseEntity<PlaceDto> createPlace(
            @PathVariable Long townId,
            @RequestBody PlaceDto placeDto) {

        return ResponseEntity.ok(
                placeService.createPlace(townId, placeDto)
        );
    }
}