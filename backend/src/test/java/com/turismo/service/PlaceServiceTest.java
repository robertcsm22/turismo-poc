package com.turismo.service;

import com.turismo.dto.PlaceDto;
import com.turismo.model.Place;
import com.turismo.model.Town;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.TownRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private PlaceService placeService;

    private Town town;

    @BeforeEach
    void setUp() {
        town = Town.builder().id(1L).slug("santa-teresa").name("Santa Teresa").build();
    }

    @Test
    void createPlace_savesAndReturnsDto() {
        when(townRepository.findById(1L)).thenReturn(Optional.of(town));
        when(placeRepository.save(any(Place.class))).thenAnswer(inv -> {
            Place p = inv.getArgument(0);
            p.setId(10L);
            return p;
        });

        PlaceDto dto = PlaceDto.builder()
                .name("Playa Carmen")
                .description("Linda playa")
                .category("PLAYA")
                .address("Centro")
                .build();

        PlaceDto result = placeService.createPlace(1L, dto);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Playa Carmen");
        assertThat(result.getCategory()).isEqualTo("PLAYA");
    }

    @Test
    void createPlace_throwsWhenTownNotFound() {
        when(townRepository.findById(99L)).thenReturn(Optional.empty());

        PlaceDto dto = PlaceDto.builder().name("X").category("PARQUE").build();

        assertThatThrownBy(() -> placeService.createPlace(99L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Pueblo no encontrado");
    }

    @Test
    void updatePlace_updatesFieldsAndReturnsDto() {
        Place existing = Place.builder()
                .id(5L).name("Old").description("old desc")
                .category(Place.Category.OTRO).town(town).build();

        when(placeRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(placeRepository.save(any(Place.class))).thenAnswer(inv -> inv.getArgument(0));

        PlaceDto dto = PlaceDto.builder()
                .name("Nuevo nombre")
                .description("nueva desc")
                .category("MUSEO")
                .address("Calle 1")
                .imageUrl("img.png")
                .latitude(9.6)
                .longitude(-85.1)
                .build();

        PlaceDto result = placeService.updatePlace(5L, dto);

        assertThat(result.getName()).isEqualTo("Nuevo nombre");
        assertThat(result.getCategory()).isEqualTo("MUSEO");
        assertThat(result.getLatitude()).isEqualTo(9.6);
        assertThat(result.getLongitude()).isEqualTo(-85.1);
    }

    @Test
    void updatePlace_throwsWhenNotFound() {
        when(placeRepository.findById(123L)).thenReturn(Optional.empty());

        PlaceDto dto = PlaceDto.builder().name("X").category("PARQUE").build();

        assertThatThrownBy(() -> placeService.updatePlace(123L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Lugar no encontrado");
    }

    @Test
    void deletePlace_deletesExistingPlace() {
        Place existing = Place.builder().id(7L).name("Borrar").category(Place.Category.OTRO).town(town).build();
        when(placeRepository.findById(7L)).thenReturn(Optional.of(existing));

        placeService.deletePlace(7L);

        verify(placeRepository).delete(existing);
    }

    @Test
    void deletePlace_throwsWhenNotFound() {
        when(placeRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> placeService.deletePlace(404L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Lugar no encontrado");
    }
}
