package com.turismo.service;

import com.turismo.dto.GoogleAuthRequest;
import com.turismo.repository.UserRepository;
import com.turismo.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "googleClientId", "test-client-id");
    }

    @Test
    void authenticateWithGoogle_throwsForInvalidIdToken() {
        GoogleAuthRequest request = GoogleAuthRequest.builder().idToken("not-a-real-token").build();

        assertThatThrownBy(() -> authService.authenticateWithGoogle(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Error al verificar token de Google");

        verifyNoInteractions(userRepository, jwtTokenProvider);
    }

    @Test
    void authenticateWithGoogle_throwsForBlankIdToken() {
        GoogleAuthRequest request = GoogleAuthRequest.builder().idToken("").build();

        assertThatThrownBy(() -> authService.authenticateWithGoogle(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Error al verificar token de Google");
    }
}
