package com.turismo.controller;

import com.turismo.dto.PlaceDto;
import com.turismo.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PlaceDto>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllActivePlacesWithStats());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/town/{townId}")
    public ResponseEntity<PlaceDto> createPlace(
            @PathVariable Long townId,
            @RequestBody PlaceDto placeDto) {

        return ResponseEntity.ok(
                placeService.createPlace(townId, placeDto)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlaceDto> updatePlace(
            @PathVariable Long id,
            @RequestBody PlaceDto placeDto) {

        return ResponseEntity.ok(
                placeService.updatePlace(id, placeDto)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {

        placeService.deletePlace(id);

        return ResponseEntity.noContent().build();
    }
}
