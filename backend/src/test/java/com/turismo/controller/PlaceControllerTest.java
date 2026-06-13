package com.turismo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turismo.dto.PlaceDto;
import com.turismo.repository.UserRepository;
import com.turismo.security.JwtTokenProvider;
import com.turismo.service.PlaceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlaceController.class)
@AutoConfigureMockMvc(addFilters = false)
class PlaceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PlaceService placeService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Test
    void createPlace_returnsCreatedPlace() throws Exception {
        PlaceDto dto = PlaceDto.builder().id(1L).name("Playa Carmen").category("PLAYA").build();
        when(placeService.createPlace(eq(1L), any(PlaceDto.class))).thenReturn(dto);

        mockMvc.perform(post("/api/places/town/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Playa Carmen"))
                .andExpect(jsonPath("$.category").value("PLAYA"));
    }

    @Test
    void updatePlace_returnsUpdatedPlace() throws Exception {
        PlaceDto dto = PlaceDto.builder().id(1L).name("Actualizado").category("MUSEO").build();
        when(placeService.updatePlace(eq(1L), any(PlaceDto.class))).thenReturn(dto);

        mockMvc.perform(put("/api/places/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Actualizado"));
    }

    @Test
    void deletePlace_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/places/1"))
                .andExpect(status().isNoContent());

        verify(placeService).deletePlace(1L);
    }
}
