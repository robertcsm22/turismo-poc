package com.turismo.config;

import com.turismo.model.Place;
import com.turismo.model.Town;
import com.turismo.repository.PlaceRepository;
import com.turismo.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final TownRepository townRepository;
    private final PlaceRepository placeRepository;

    @Bean
    @Profile("!test")  // No correr en tests
    public CommandLineRunner seedData() {
        return args -> {
            if (townRepository.count() > 0) {
                log.info("La base de datos ya tiene datos, no se siembra.");
                return;
            }

            log.info("Sembrando datos iniciales...");

            // Pueblo de ejemplo — cambiar por el pueblo asignado
            Town town = Town.builder()
                    .slug("santa-teresa")
                    .name("Santa Teresa")
                    .description("Hermoso pueblo costero de Guanacaste con playas vírgenes y vida tranquila.")
                    .province("Guanacaste")
                    .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                    .build();
            town = townRepository.save(town);

            Place p1 = Place.builder()
                    .name("Playa Santa Teresa")
                    .description("Playa de arena blanca ideal para surf y puestas de sol espectaculares.")
                    .category(Place.Category.PLAYA)
                    .address("Playa Santa Teresa, Cóbano, Puntarenas")
                    .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                    .latitude(9.6466)
                    .longitude(-85.1700)
                    .town(town)
                    .build();

            Place p2 = Place.builder()
                    .name("Mirador El Canto")
                    .description("Vista panorámica del Pacífico al atardecer. Imperdible para fotógrafos.")
                    .category(Place.Category.MIRADOR)
                    .address("200 metros norte de la escuela, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800")
                    .latitude(9.6490)
                    .longitude(-85.1680)
                    .town(town)
                    .build();

            Place p3 = Place.builder()
                    .name("Restaurante El Pescador")
                    .description("Mariscos frescos del día. Especialidad en ceviche tico y casados.")
                    .category(Place.Category.RESTAURANTE)
                    .address("Frente a la playa principal, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800")
                    .latitude(9.6450)
                    .longitude(-85.1710)
                    .town(town)
                    .build();

            placeRepository.save(p1);
            placeRepository.save(p2);
            placeRepository.save(p3);

            log.info("Datos sembrados: 1 pueblo, 3 lugares.");
        };
    }
}
