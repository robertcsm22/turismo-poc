package com.turismo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "places")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String nameEn;

    @Column(length = 2000)
    private String descriptionEn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    private String address;

    private String imageUrl;

    // Coordenadas para mapa interactivo (bonus)
    private Double latitude;
    private Double longitude;

    @Builder.Default
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "town_id", nullable = false)
    private Town town;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum Category {
        RESTAURANTE, PARQUE, MUSEO, MIRADOR, HOTEL, PLAYA, CULTURAL, GASTRONOMIA, OTRO
    }
}
