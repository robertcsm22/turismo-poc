package com.turismo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Lo que el backend devuelve tras autenticar con Google
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;   // JWT propio del backend
    private UserDto user;
}
