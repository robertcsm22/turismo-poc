package com.turismo.controller;

import com.turismo.dto.PlaceDto;
import com.turismo.dto.TownDto;
import com.turismo.repository.UserRepository;
import com.turismo.security.JwtTokenProvider;
import com.turismo.service.TownService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TownController.class)
@AutoConfigureMockMvc(addFilters = false)
class TownControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TownService townService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Test
    void getTown_returnsTownData() throws Exception {
        TownDto town = TownDto.builder().id(1L).slug("santa-teresa").name("Santa Teresa").province("Guanacaste").build();
        when(townService.getTownBySlug("santa-teresa")).thenReturn(town);

        mockMvc.perform(get("/api/towns/santa-teresa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Santa Teresa"))
                .andExpect(jsonPath("$.province").value("Guanacaste"));
    }

    @Test
    void getPlaces_returnsPlaceList() throws Exception {
        PlaceDto place = PlaceDto.builder().id(1L).name("Playa Santa Teresa").category("PLAYA").build();
        when(townService.getPlacesByTownSlug("santa-teresa")).thenReturn(List.of(place));

        mockMvc.perform(get("/api/towns/santa-teresa/places"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Playa Santa Teresa"))
                .andExpect(jsonPath("$[0].category").value("PLAYA"));
    }
}
