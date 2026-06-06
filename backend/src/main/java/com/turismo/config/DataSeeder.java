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
    @Profile("!test")
    public CommandLineRunner seedData() {
        return args -> {
            if (townRepository.count() > 0) {
                log.info("La base de datos ya tiene datos, no se siembra.");
                return;
            }

            log.info("Sembrando datos iniciales...");

            Town town = Town.builder()
                    .slug("santa-teresa")
                    .name("Santa Teresa")
                    .description("Hermoso pueblo costero de Puntarenas con playas vírgenes, surf de clase mundial y una vibrante vida local rodeada de naturaleza tropical.")
                    .province("Puntarenas")
                    .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                    .build();
            town = townRepository.save(town);

            // PLAYAS
            placeRepository.save(Place.builder()
                    .name("Playa Santa Teresa").description("Playa de arena blanca ideal para surf y puestas de sol espectaculares. Una de las mejores olas de Costa Rica.")
                    .category(Place.Category.PLAYA).address("Playa Santa Teresa, Cóbano, Puntarenas")
                    .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                    .latitude(9.6466).longitude(-85.1700).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Playa El Carmen").description("Playa tranquila perfecta para familias y principiantes en surf. Aguas cálidas y arena dorada.")
                    .category(Place.Category.PLAYA).address("Playa El Carmen, Cóbano, Puntarenas")
                    .imageUrl("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800")
                    .latitude(9.6510).longitude(-85.1720).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Playa Manzanillo").description("Playa secreta al sur de Santa Teresa. Ideal para snorkel y observación de vida marina.")
                    .category(Place.Category.PLAYA).address("Playa Manzanillo, Cóbano, Puntarenas")
                    .imageUrl("https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800")
                    .latitude(9.6380).longitude(-85.1750).town(town).build());

            // RESTAURANTES
            placeRepository.save(Place.builder()
                    .name("Restaurante El Pescador").description("Mariscos frescos del día traídos directamente del mar. Especialidad en ceviche tico y casados.")
                    .category(Place.Category.RESTAURANTE).address("Frente a la playa principal, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800")
                    .latitude(9.6450).longitude(-85.1710).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Soda La Tica").description("Comida casera costarricense auténtica. El mejor gallo pinto del pueblo y jugos naturales.")
                    .category(Place.Category.RESTAURANTE).address("100 metros este del supermercado, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800")
                    .latitude(9.6455).longitude(-85.1695).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Burger Shack").description("Las mejores hamburguesas artesanales de la zona. Ambiente relajado y vista al jardín tropical.")
                    .category(Place.Category.RESTAURANTE).address("Calle principal, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800")
                    .latitude(9.6462).longitude(-85.1705).town(town).build());

            // MIRADORES
            placeRepository.save(Place.builder()
                    .name("Mirador El Canto").description("Vista panorámica del Pacífico al atardecer. Imperdible para fotógrafos y amantes de la naturaleza.")
                    .category(Place.Category.MIRADOR).address("200 metros norte de la escuela, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800")
                    .latitude(9.6490).longitude(-85.1680).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Cerro Tambor").description("Caminata de 45 minutos hasta un mirador con vistas 360° de la costa. Apto para todos los niveles.")
                    .category(Place.Category.MIRADOR).address("Sendero Cerro Tambor, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                    .latitude(9.6520).longitude(-85.1650).town(town).build());

            // HOTELES
            placeRepository.save(Place.builder()
                    .name("Hotel Tropico Latino").description("Hotel boutique frente al mar con piscina infinita y clases de yoga al amanecer.")
                    .category(Place.Category.HOTEL).address("Frente a Playa Santa Teresa, Cóbano")
                    .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800")
                    .latitude(9.6470).longitude(-85.1715).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Hostel Punto de Vista").description("Alojamiento económico con vistas al mar. Ambiente social ideal para viajeros y surfistas.")
                    .category(Place.Category.HOTEL).address("Calle principal, Santa Teresa, Cóbano")
                    .imageUrl("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800")
                    .latitude(9.6458).longitude(-85.1698).town(town).build());

            // PARQUES
            placeRepository.save(Place.builder()
                    .name("Reserva Natural Cabo Blanco").description("Primera reserva natural de Costa Rica. Hogar de monos capuchinos, pelícanos y flora endémica.")
                    .category(Place.Category.PARQUE).address("Cabo Blanco, 10 km al sur de Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1448375240586-882707db888b?w=800")
                    .latitude(9.5880).longitude(-85.1300).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Parque Marino Las Tortugas").description("Área protegida donde anidan tortugas marinas. Visitas guiadas disponibles en temporada.")
                    .category(Place.Category.PARQUE).address("Playa Manzanillo, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800")
                    .latitude(9.6375).longitude(-85.1760).town(town).build());

            // CULTURAL
            placeRepository.save(Place.builder()
                    .name("Mercado Artesanal Santa Teresa").description("Mercado local con artesanías, joyería hecha a mano y productos orgánicos de la región.")
                    .category(Place.Category.CULTURAL).address("Centro de Santa Teresa, frente a la iglesia")
                    .imageUrl("https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800")
                    .latitude(9.6460).longitude(-85.1690).town(town).build());

            // GASTRONOMIA
            placeRepository.save(Place.builder()
                    .name("Feria del Agricultor").description("Todos los sábados: frutas tropicales, verduras orgánicas y comidas típicas preparadas por familias locales.")
                    .category(Place.Category.GASTRONOMIA).address("Cancha de fútbol, Santa Teresa, Cóbano")
                    .imageUrl("https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800")
                    .latitude(9.6465).longitude(-85.1685).town(town).build());

            placeRepository.save(Place.builder()
                    .name("Heladería Tropical").description("Helados artesanales de frutas locales: maracuyá, guanábana, cas y más. El favorito de los locales.")
                    .category(Place.Category.GASTRONOMIA).address("Calle principal, Santa Teresa")
                    .imageUrl("https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800")
                    .latitude(9.6452).longitude(-85.1702).town(town).build());

            log.info("Datos sembrados: 1 pueblo, 15 lugares.");
        };
    }
}