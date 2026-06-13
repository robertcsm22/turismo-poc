package com.turismo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "towns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Town {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Slug único para la URL del QR: /p/santa-teresa
    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String nameEn;

    @Column(length = 1000)
    private String descriptionEn;

    private String province;

    private String imageUrl;

    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "town", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Place> places;
}
