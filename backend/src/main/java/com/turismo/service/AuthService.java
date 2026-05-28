package com.turismo.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.turismo.dto.AuthResponse;
import com.turismo.dto.GoogleAuthRequest;
import com.turismo.dto.UserDto;
import com.turismo.model.User;
import com.turismo.repository.UserRepository;
import com.turismo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${google.client-id}")
    private String googleClientId;

    /**
     * Verifica el ID Token de Google y crea/actualiza el usuario en la BD.
     * Devuelve un JWT propio del sistema.
     *
     * Flujo:
     * 1. Frontend hace login con Google → recibe "credential" (ID Token)
     * 2. Frontend envía ese token al backend (POST /api/auth/google)
     * 3. Backend verifica el token con GoogleIdTokenVerifier
     * 4. Backend crea/actualiza el usuario y emite su propio JWT
     */
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        GoogleIdToken.Payload payload = verifyGoogleToken(request.getIdToken());

        String email = payload.getEmail();
        String googleId = payload.getSubject();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        // Solo se permiten correos Gmail (el enunciado lo requiere)
        if (!email.endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Solo se aceptan cuentas Gmail (@gmail.com)");
        }

        // Crear o actualizar el usuario
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email)
                        .orElse(User.builder()
                                .email(email)
                                .googleId(googleId)
                                .build()));

        user.setName(name);
        user.setPictureUrl(picture);
        user.setGoogleId(googleId);
        user.setLastLoginAt(LocalDateTime.now());
        user = userRepository.save(user);

        log.info("Usuario autenticado: {} ({})", email, user.getRole());

        String jwt = jwtTokenProvider.generateToken(email, user.getRole().name());

        return AuthResponse.builder()
                .token(jwt)
                .user(UserDto.from(user))
                .build();
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                throw new IllegalArgumentException("Token de Google inválido o expirado");
            }
            return googleIdToken.getPayload();

        } catch (Exception e) {
            log.error("Error verificando token de Google: {}", e.getMessage());
            throw new RuntimeException("Error al verificar token de Google: " + e.getMessage());
        }
    }
}
