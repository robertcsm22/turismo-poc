package com.turismo;

import com.turismo.model.Place;
import com.turismo.model.Town;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.TownRepository;
import com.turismo.service.TownService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TownServiceTest {

    @Mock
    private TownRepository townRepository;

    @Mock
    private PlaceRepository placeRepository;

    @InjectMocks
    private TownService townService;

    private Town sampleTown;

    @BeforeEach
    void setUp() {
        sampleTown = Town.builder()
                .id(1L)
                .slug("santa-teresa")
                .name("Santa Teresa")
                .description("Hermoso pueblo costero")
                .province("Guanacaste")
                .build();
    }

    @Test
    void getTownBySlug_returnsCorrectTown() {
        when(townRepository.findBySlugAndActiveTrue("santa-teresa"))
                .thenReturn(Optional.of(sampleTown));

        var result = townService.getTownBySlug("santa-teresa");

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Santa Teresa");
        assertThat(result.getSlug()).isEqualTo("santa-teresa");
    }

    @Test
    void getTownBySlug_throwsWhenNotFound() {
        when(townRepository.findBySlugAndActiveTrue("inexistente"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> townService.getTownBySlug("inexistente"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Pueblo no encontrado");
    }

    @Test
    void getPlacesByTownSlug_returnsPlacesList() {
        Place place = Place.builder()
                .id(1L)
                .name("Playa Santa Teresa")
                .category(Place.Category.PLAYA)
                .town(sampleTown)
                .build();

        when(placeRepository.findByTownSlugAndActiveTrue("santa-teresa"))
                .thenReturn(List.of(place));

        var places = townService.getPlacesByTownSlug("santa-teresa");

        assertThat(places).hasSize(1);
        assertThat(places.get(0).getName()).isEqualTo("Playa Santa Teresa");
        assertThat(places.get(0).getCategory()).isEqualTo("PLAYA");
    }
}
