package com.turismo.controller;

import com.turismo.dto.AuthResponse;
import com.turismo.dto.GoogleAuthRequest;
import com.turismo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/google
     * Recibe el ID Token de Google y devuelve un JWT propio + datos del usuario.
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> authenticateWithGoogle(@RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.authenticateWithGoogle(request);
        return ResponseEntity.ok(response);
    }
}
