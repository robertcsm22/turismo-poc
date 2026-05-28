package com.turismo.controller;

import com.turismo.dto.PlaceDto;
import com.turismo.dto.TownDto;
import com.turismo.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    /**
     * GET /api/towns/{slug}
     * Retorna los datos del pueblo (por slug, ej: santa-teresa)
     * Este endpoint es PÚBLICO — lo necesita el QR
     */
    @GetMapping("/{slug}")
    public ResponseEntity<TownDto> getTown(@PathVariable String slug) {
        return ResponseEntity.ok(townService.getTownBySlug(slug));
    }

    /**
     * GET /api/towns/{slug}/places
     * Lista los lugares turísticos del pueblo.
     * PÚBLICO — el frontend lo llama tras autenticar con Google.
     */
    @GetMapping("/{slug}/places")
    public ResponseEntity<List<PlaceDto>> getPlaces(@PathVariable String slug) {
        return ResponseEntity.ok(townService.getPlacesByTownSlug(slug));
    }
}
