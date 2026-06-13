package com.turismo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turismo.dto.AuthResponse;
import com.turismo.dto.GoogleAuthRequest;
import com.turismo.dto.UserDto;
import com.turismo.repository.UserRepository;
import com.turismo.security.JwtTokenProvider;
import com.turismo.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Test
    void authenticateWithGoogle_returnsTokenAndUser() throws Exception {
        UserDto user = UserDto.builder().id(1L).email("user@gmail.com").name("User").role("USER").build();
        AuthResponse response = AuthResponse.builder().token("jwt-token").user(user).build();

        when(authService.authenticateWithGoogle(any(GoogleAuthRequest.class))).thenReturn(response);

        GoogleAuthRequest request = GoogleAuthRequest.builder().idToken("fake-id-token").build();

        mockMvc.perform(post("/api/auth/google")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("user@gmail.com"));
    }
}
