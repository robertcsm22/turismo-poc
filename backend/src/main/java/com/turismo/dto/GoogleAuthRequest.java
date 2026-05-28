package com.turismo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO que el frontend envía con el ID Token de Google
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthRequest {
    private String idToken;  // El credential que devuelve Google Sign-In
}
