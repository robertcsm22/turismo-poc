package com.turismo.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "test-secret-key-for-jwt-signing-1234567890");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 3600000L);
    }

    @Test
    void generateToken_allowsExtractingEmail() {
        String token = tokenProvider.generateToken("user@gmail.com", "USER");

        assertThat(token).isNotBlank();
        assertThat(tokenProvider.getEmailFromToken(token)).isEqualTo("user@gmail.com");
    }

    @Test
    void validateToken_returnsTrueForFreshToken() {
        String token = tokenProvider.generateToken("admin@gmail.com", "ADMIN");

        assertThat(tokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_returnsFalseForMalformedToken() {
        assertThat(tokenProvider.validateToken("not-a-valid-token")).isFalse();
    }

    @Test
    void validateToken_returnsFalseForExpiredToken() {
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", -1000L);

        String token = tokenProvider.generateToken("user@gmail.com", "USER");

        assertThat(tokenProvider.validateToken(token)).isFalse();
    }
}
