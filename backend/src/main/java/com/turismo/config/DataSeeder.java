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
            seedSantaTeresa();
            seedTamarindo();
            seedManuelAntonio();
            seedJaco();
            seedConchal();
        };
    }

    private void seedSantaTeresa() {
        if (townRepository.findBySlug("santa-teresa").isPresent()) {
            log.info("Santa Teresa ya existe, se omite.");
            return;
        }
        log.info("Sembrando Santa Teresa...");

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

        log.info("Santa Teresa sembrada: 15 lugares.");
    }

    private void seedTamarindo() {
        if (townRepository.findBySlug("tamarindo").isPresent()) {
            log.info("Tamarindo ya existe, se omite.");
            return;
        }
        log.info("Sembrando Tamarindo...");

        Town town = Town.builder()
                .slug("tamarindo")
                .name("Playa Tamarindo")
                .description("El destino más animado de Guanacaste. Famoso por sus olas perfectas para surf, vida nocturna vibrante y atardeceres dorados sobre el Pacífico.")
                .province("Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                .build();
        town = townRepository.save(town);

        // PLAYA
        placeRepository.save(Place.builder()
                .name("Playa Tamarindo").description("Playa de arena dorada con olas perfectas para surf. Centro de la vida costera de Guanacaste, ideal para aprender a surfear y ver atardeceres.")
                .category(Place.Category.PLAYA).address("Playa Tamarindo, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                .latitude(10.2988).longitude(-85.8366).town(town).build());

        // RESTAURANTE
        placeRepository.save(Place.builder()
                .name("Nogui's Restaurant").description("Icónico restaurante frente al mar abierto desde 1974. Especialidad en mariscos frescos, casados ticos y ceviche artesanal. El lugar más querido de Tamarindo.")
                .category(Place.Category.RESTAURANTE).address("Frente a la playa principal, Tamarindo, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800")
                .latitude(10.2995).longitude(-85.8373).town(town).build());

        // PARQUE
        placeRepository.save(Place.builder()
                .name("Estero de Tamarindo").description("Reserva nacional de humedales con manglares densos. Hogar de cocodrilos, monos aulladores, iguanas y más de 50 especies de aves. Tours en kayak disponibles.")
                .category(Place.Category.PARQUE).address("Estero de Tamarindo, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1448375240586-882707db888b?w=800")
                .latitude(10.2945).longitude(-85.8345).town(town).build());

        // HOTEL
        placeRepository.save(Place.builder()
                .name("Tamarindo Diría Beach Resort").description("Resort icónico frente al mar con piscinas tropicales, acceso directo a la playa y restaurante de primera. El alojamiento más emblemático de Tamarindo.")
                .category(Place.Category.HOTEL).address("Playa Tamarindo, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800")
                .latitude(10.2982).longitude(-85.8375).town(town).build());

        // CULTURAL
        placeRepository.save(Place.builder()
                .name("Witch's Rock Surf Camp").description("Escuela de surf legendaria fundada en 1997. Clases para todos los niveles, alquiler de tablas y comunidad internacional de surfistas. Punto de encuentro cultural de Tamarindo.")
                .category(Place.Category.CULTURAL).address("Calle principal, Tamarindo, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?w=800")
                .latitude(10.2972).longitude(-85.8371).town(town).build());

        log.info("Tamarindo sembrado: 5 lugares.");
    }

    private void seedManuelAntonio() {
        if (townRepository.findBySlug("manuel-antonio").isPresent()) {
            log.info("Manuel Antonio ya existe, se omite.");
            return;
        }
        log.info("Sembrando Manuel Antonio...");

        Town town = Town.builder()
                .slug("manuel-antonio")
                .name("Playa Manuel Antonio")
                .description("El parque nacional más visitado de Costa Rica. Playas de arena blanca rodeadas de selva tropical, con monos, perezosos y una biodiversidad extraordinaria.")
                .province("Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1448375240586-882707db888b?w=800")
                .build();
        town = townRepository.save(town);

        placeRepository.save(Place.builder()
                .name("Parque Nacional Manuel Antonio").description("El parque más visitado de Costa Rica. Hogar de monos capuchinos, perezosos de dos dedos, mariposas gigantes y playas vírgenes dentro de la selva. Patrimonio natural de Costa Rica.")
                .category(Place.Category.PARQUE).address("Quepos, Puntarenas, Costa Rica")
                .imageUrl("https://images.unsplash.com/photo-1448375240586-882707db888b?w=800")
                .latitude(9.3862).longitude(-84.1432).town(town).build());

        placeRepository.save(Place.builder()
                .name("Playa Manuel Antonio").description("Playa de arena blanca dentro del parque nacional, rodeada de vegetación tropical. Aguas cristalinas perfectas para nadar y hacer snorkel entre peces tropicales.")
                .category(Place.Category.PLAYA).address("Parque Nacional Manuel Antonio, Quepos")
                .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                .latitude(9.3848).longitude(-84.1429).town(town).build());

        placeRepository.save(Place.builder()
                .name("El Avión Restaurant").description("Restaurante único instalado dentro de un avión de transporte C-123 de la era de los Contras. Mariscos de primera, cocteles tropicales y una historia fascinante. Vista panorámica al Pacífico.")
                .category(Place.Category.RESTAURANTE).address("Carretera a Manuel Antonio, Quepos, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800")
                .latitude(9.3981).longitude(-84.1574).town(town).build());

        placeRepository.save(Place.builder()
                .name("Hotel Si Como No Resort").description("Eco-resort boutique en la colina con vista al Pacífico. Piscinas de infinito, restaurante de altura, spa y tours de naturaleza. Certificado de Sostenibilidad Turística nivel 5.")
                .category(Place.Category.HOTEL).address("Manuel Antonio, Quepos, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800")
                .latitude(9.3921).longitude(-84.1543).town(town).build());

        placeRepository.save(Place.builder()
                .name("Mirador Punta Quepos").description("Mirador natural en los acantilados de Quepos con vista de 180° al Océano Pacífico. El lugar ideal para ver delfines, pelícanos y el atardecer más hermoso de la costa.")
                .category(Place.Category.MIRADOR).address("Punta Quepos, Quepos, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800")
                .latitude(9.4088).longitude(-84.1593).town(town).build());

        log.info("Manuel Antonio sembrado: 5 lugares.");
    }

    private void seedJaco() {
        if (townRepository.findBySlug("jaco").isPresent()) {
            log.info("Jacó ya existe, se omite.");
            return;
        }
        log.info("Sembrando Jacó...");

        Town town = Town.builder()
                .slug("jaco")
                .name("Playa Jacó")
                .description("La playa más accesible desde San José, a solo 1.5 horas. Centro de surf, vida nocturna y aventura de la costa central. Punto de partida para explorar Carara y los cocodrilos del Tárcoles.")
                .province("Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                .build();
        town = townRepository.save(town);

        placeRepository.save(Place.builder()
                .name("Playa Jacó").description("Playa de arena negra volcánica de 4 km. Famosa por olas consistentes para surf intermedio-avanzado, atardeceres naranjas sobre el Pacífico y ambiente vibrante durante todo el año.")
                .category(Place.Category.PLAYA).address("Playa Jacó, Garabito, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800")
                .latitude(9.6143).longitude(-84.6277).town(town).build());

        placeRepository.save(Place.builder()
                .name("El Barco Restaurant").description("El marisquería más querida de Jacó con más de 20 años frente al mar. Ceviche tico, arroces con mariscos, corvina al ajillo y el mejor atún fresco del Pacífico Central.")
                .category(Place.Category.RESTAURANTE).address("Av. Pastor Díaz, Jacó, Garabito, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800")
                .latitude(9.6149).longitude(-84.6283).town(town).build());

        placeRepository.save(Place.builder()
                .name("Parque Nacional Carara").description("Zona de transición entre el trópico seco y húmedo. Hogar de la mayor colonia de lapas rojas de Costa Rica. El Río Tárcoles junto a la entrada alberga decenas de cocodrilos observables desde el puente.")
                .category(Place.Category.PARQUE).address("Ruta 34, Tárcoles, Garabito, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1448375240586-882707db888b?w=800")
                .latitude(9.7660).longitude(-84.5990).town(town).build());

        placeRepository.save(Place.builder()
                .name("Hotel Tangeri").description("Hotel clásico de Jacó frente al mar con piscina, restaurante propio y acceso directo a la playa. Favorito de surfistas y familias por su excelente ubicación en el centro de Jacó.")
                .category(Place.Category.HOTEL).address("Av. Pastor Díaz, Jacó Centro, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800")
                .latitude(9.6155).longitude(-84.6275).town(town).build());

        placeRepository.save(Place.builder()
                .name("Escuela de Surf Jacó").description("La escuela de surf más recomendada de la costa central. Clases para principiantes y perfeccionamiento para intermedios. Instructores certificados, tablas de todos los tamaños y sesiones fotográficas incluidas.")
                .category(Place.Category.CULTURAL).address("Playa Jacó Norte, Garabito, Puntarenas")
                .imageUrl("https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?w=800")
                .latitude(9.6148).longitude(-84.6290).town(town).build());

        log.info("Jacó sembrado: 5 lugares.");
    }

    private void seedConchal() {
        if (townRepository.findBySlug("conchal").isPresent()) {
            log.info("Conchal ya existe, se omite.");
            return;
        }
        log.info("Sembrando Conchal...");

        Town town = Town.builder()
                .slug("conchal")
                .name("Playa Conchal")
                .description("Una playa única en el mundo, formada por millones de conchas trituradas que crean una arena blanca y suave. Aguas turquesas tranquilas, ideal para familias y buceo en el norte de Guanacaste.")
                .province("Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                .build();
        town = townRepository.save(town);

        placeRepository.save(Place.builder()
                .name("Playa Conchal").description("Una de las playas más hermosas de América Central. Su arena está compuesta completamente por millones de conchas trituradas de color blanco perlado. Aguas turquesas, tranquilas y cálidas, perfectas para snorkel y buceo.")
                .category(Place.Category.PLAYA).address("Playa Conchal, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                .latitude(10.3780).longitude(-85.7810).town(town).build());

        placeRepository.save(Place.builder()
                .name("The Westin Reserva Conchal").description("Resort de lujo de 2400 acres con acceso exclusivo a Playa Conchal. Cuatro piscinas, campo de golf de 18 hoyos, spa de clase mundial, 9 restaurantes y actividades de naturaleza para toda la familia.")
                .category(Place.Category.HOTEL).address("Playa Conchal, Brasilito, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800")
                .latitude(10.3792).longitude(-85.7820).town(town).build());

        placeRepository.save(Place.builder()
                .name("Parque Nacional Marino Las Baulas").description("Área protegida para la anidación de la tortuga baula, la más grande del mundo. De octubre a febrero llegan cientos de tortugas a desovar por las noches. Tours nocturnos con guías certificados disponibles en temporada.")
                .category(Place.Category.PARQUE).address("Playa Grande, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800")
                .latitude(10.3900).longitude(-85.7750).town(town).build());

        placeRepository.save(Place.builder()
                .name("Restaurante El Camaron Dorado").description("Marisquería familiar en Brasilito con más de 25 años de historia. Cangrejo en salsa criolla, langosta a la mantequilla y el mejor ceviche de Guanacaste. Mesas frente al mar, ambiente relajado.")
                .category(Place.Category.RESTAURANTE).address("Frente al parque de Brasilito, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800")
                .latitude(10.3760).longitude(-85.7805).town(town).build());

        placeRepository.save(Place.builder()
                .name("Pueblo de Brasilito").description("Auténtico pueblo pesquero a 500 metros de Playa Conchal. Mercado local con artesanías de madera, cerámica guanacasteca y joyería de conchas. Los domingos hay feria de comidas típicas con chifrijo, tamales y agua dulce.")
                .category(Place.Category.CULTURAL).address("Brasilito, Santa Cruz, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800")
                .latitude(10.3750).longitude(-85.7800).town(town).build());

        log.info("Conchal sembrado: 5 lugares.");
    }
}
