/* =========================================================
   CONFIGURACIÓN DE LA TIENDA
   Cambia estos datos para adaptar la maqueta a cada cliente.
   También se pueden cambiar desde el link, sin tocar código:
   ?tienda=Nombre&color=ff4a0b&wa=56912345678&ig=usuario&ciudad=Talca
   ========================================================= */

const TIENDA = {
  nombre: "Tu Tienda TCG",
  eslogan: "Cartas, sobres y accesorios para tu próximo torneo",
  ciudad: "Santiago",
  direccion: "Av. Ejemplo 1234, local 12",
  whatsapp: "56900000000",          // sin + ni espacios
  instagram: "tutiendatcg",
  email: "contacto@tutiendatcg.cl",
  color: "#7C3AED",                  // color principal de la marca
  envioGratisDesde: 50000,           // monto para envío gratis (0 = sin envío gratis)
  // Horario: día (0 domingo … 6 sábado) → [apertura, cierre]. Sin entrada = cerrado
  horario: {
    1: ["11:00", "20:00"],
    2: ["11:00", "20:00"],
    3: ["11:00", "20:00"],
    4: ["11:00", "20:00"],
    5: ["11:00", "21:00"],
    6: ["11:00", "21:00"],
  },
  avisos: [
    "Envíos a todo Chile",
    "Retiro gratis en tienda",
    "Torneos todos los viernes",
    "Productos 100% originales",
  ],
};

// Fecha en que terminan las ofertas (para la cuenta regresiva)
const OFERTAS_HASTA = "2026-11-30T23:59:00-03:00";

// Banner principal. fondo: "marca" | "oscuro" | "degradado" · arte: "sobre" | "caja" | "cartas"
const BANNERS = [
  { etiqueta: "Nuevo lanzamiento", titulo: "La nueva expansión ya está en tienda", texto: "Sobres, cajas de entrenador y displays. Asegura el tuyo antes de que se agoten.", boton: "Ver productos", link: "productos.html?orden=nuevo", fondo: "marca", arte: "sobre" },
  { etiqueta: "Ofertas de la semana", titulo: "Hasta 30% de descuento en sellado", texto: "Cajas, mazos y accesorios seleccionados por tiempo limitado.", boton: "Ver ofertas", link: "ofertas.html", fondo: "oscuro", arte: "caja" },
  { etiqueta: "Preventa abierta", titulo: "Reserva la próxima colección", texto: "Paga hoy y retira el día del lanzamiento. Cupos limitados.", boton: "Ver preventas", link: "productos.html?tipo=Preventa", fondo: "degradado", arte: "cartas" },
];

// Categorías por juego (color = color de las tarjetas de ese juego)
const CATEGORIAS = [
  { id: "pokemon", nombre: "Pokémon TCG", color: "#F5B700" },
  { id: "magic", nombre: "Magic", color: "#C2410C" },
  { id: "yugioh", nombre: "Yu-Gi-Oh!", color: "#7C3AED" },
  { id: "onepiece", nombre: "One Piece", color: "#DC2626" },
  { id: "mitos", nombre: "Mitos y Leyendas", color: "#0F766E" },
  { id: "accesorios", nombre: "Accesorios", color: "#334155" },
];

// Productos. tipo: Sobre | Caja | Mazo | Display | Accesorio | Preventa
// oferta: precio rebajado (o null) · stock: unidades · nuevo / destacado: true para mostrar en el inicio
const PRODUCTOS = [
  { id: "p1", nombre: "Sobre de expansión", juego: "pokemon", tipo: "Sobre", precio: 4990, oferta: null, stock: 60, nuevo: true, destacado: true },
  { id: "p2", nombre: "Caja de entrenador élite", juego: "pokemon", tipo: "Caja", precio: 54990, oferta: 46990, stock: 6, nuevo: true, destacado: true },
  { id: "p3", nombre: "Display 36 sobres", juego: "pokemon", tipo: "Display", precio: 159990, oferta: null, stock: 2, destacado: true },
  { id: "p4", nombre: "Mazo de inicio para dos", juego: "pokemon", tipo: "Mazo", precio: 19990, oferta: 15990, stock: 12 },
  { id: "p5", nombre: "Sobre de juego", juego: "magic", tipo: "Sobre", precio: 6490, oferta: null, stock: 40, nuevo: true },
  { id: "p6", nombre: "Mazo Commander preconstruido", juego: "magic", tipo: "Mazo", precio: 49990, oferta: 39990, stock: 4, destacado: true },
  { id: "p7", nombre: "Caja de sobres de coleccionista", juego: "magic", tipo: "Display", precio: 189990, oferta: null, stock: 0 },
  { id: "p8", nombre: "Sobre de booster", juego: "yugioh", tipo: "Sobre", precio: 2990, oferta: null, stock: 80 },
  { id: "p9", nombre: "Structure Deck", juego: "yugioh", tipo: "Mazo", precio: 12990, oferta: 9990, stock: 9 },
  { id: "p10", nombre: "Sobre de expansión", juego: "onepiece", tipo: "Sobre", precio: 3990, oferta: null, stock: 50, nuevo: true },
  { id: "p11", nombre: "Starter Deck", juego: "onepiece", tipo: "Mazo", precio: 14990, oferta: null, stock: 7, destacado: true },
  { id: "p12", nombre: "Sobre Primer Bloque", juego: "mitos", tipo: "Sobre", precio: 2500, oferta: null, stock: 100 },
  { id: "p13", nombre: "Mazo estructurado", juego: "mitos", tipo: "Mazo", precio: 9990, oferta: 7990, stock: 15 },
  { id: "p14", nombre: "Fundas mate x100", juego: "accesorios", tipo: "Accesorio", precio: 8990, oferta: null, stock: 40 },
  { id: "p15", nombre: "Deck box magnético", juego: "accesorios", tipo: "Accesorio", precio: 12990, oferta: 9990, stock: 18, destacado: true },
  { id: "p16", nombre: "Playmat de goma 60x35", juego: "accesorios", tipo: "Accesorio", precio: 15990, oferta: null, stock: 3 },
  { id: "p17", nombre: "Carpeta 9 bolsillos", juego: "accesorios", tipo: "Accesorio", precio: 19990, oferta: 16990, stock: 10 },
  { id: "p18", nombre: "Preventa: próxima expansión (display)", juego: "pokemon", tipo: "Preventa", precio: 169990, oferta: null, stock: 10, nuevo: true },
  { id: "p19", nombre: "Preventa: próximo Starter Deck", juego: "onepiece", tipo: "Preventa", precio: 15990, oferta: null, stock: 15 },
];

// Descripción corta por tipo (se usa en la vista rápida del producto)
const DESCRIPCIONES = {
  Sobre: "Sobre sellado original. Ideal para abrir en tienda o sumar a tu colección.",
  Caja: "Caja sellada con sobres, accesorios y fundas. Perfecta para regalar.",
  Display: "Display sellado con sobres. Mejor precio por sobre para coleccionistas.",
  Mazo: "Mazo listo para jugar. Ideal para empezar o para tu primer torneo.",
  Accesorio: "Protege y transporta tus cartas como un profesional.",
  Preventa: "Reserva hoy y retira el día del lanzamiento. Cupos limitados.",
};

/* =========================================================
   TORNEOS
   Las fechas se calculan desde hoy para que la maqueta siempre muestre torneos próximos.
   dia: 0 domingo … 6 sábado · semana: 0 = esta semana, 1 = la próxima… · cupos / inscritos
   ========================================================= */
const TORNEOS = [
  { id: "t1", nombre: "Liga Pokémon TCG · Fecha 6", juego: "pokemon", formato: "Estándar", dia: 6, semana: 0, hora: "16:00", valor: 4000, cupos: 32, inscritos: 22, premio: "Sobres según asistencia + puntos de liga" },
  { id: "t2", nombre: "Commander casual", juego: "magic", formato: "Commander", dia: 5, semana: 0, hora: "19:00", valor: 3000, cupos: 16, inscritos: 16, premio: "Sobre para cada mesa ganadora" },
  { id: "t3", nombre: "Liga Yu-Gi-Oh! · Fecha 4", juego: "yugioh", formato: "Avanzado", dia: 5, semana: 1, hora: "18:30", valor: 4000, cupos: 24, inscritos: 11, premio: "Sobres para el Top 4 + puntos de liga" },
  { id: "t4", nombre: "Torneo One Piece", juego: "onepiece", formato: "Estándar", dia: 0, semana: 1, hora: "15:00", valor: 5000, cupos: 24, inscritos: 20, premio: "Premios para el Top 8" },
  { id: "t5", nombre: "Mitos y Leyendas Primer Bloque", juego: "mitos", formato: "Primer Bloque", dia: 6, semana: 1, hora: "15:30", valor: 4000, cupos: 32, inscritos: 9, premio: "Sobres según asistencia" },
  { id: "t6", nombre: "Clasificatorio regional Pokémon TCG", juego: "pokemon", formato: "Estándar", dia: 6, semana: 2, hora: "11:00", valor: 10000, cupos: 48, inscritos: 30, premio: "Cupos al Nacional + trofeo", destacado: true },
];
const CUPOS_BAJOS = 5; // desde aquí aparece "Últimos cupos"

/* =========================================================
   LIGAS: tabla de posiciones por juego
   Cada fila: [nombre, fechas jugadas, victorias, puntos]. El orden se calcula solo.
   Opcional: pega aquí el link CSV de una hoja de Google publicada
   (Archivo → Compartir → Publicar en la web → CSV) con columnas:
   liga, nombre, fechas, victorias, puntos. Así la tienda actualiza la tabla sin tocar código.
   ========================================================= */
const LIGAS_CSV = "";
const LIGAS = {
  "Pokémon TCG": [
    ["Matías R.", 6, 4, 22], ["Camila S.", 6, 3, 19], ["Diego M.", 5, 3, 17], ["Benjamín T.", 6, 2, 15],
    ["Javiera P.", 5, 2, 14], ["Tomás A.", 6, 1, 12], ["Ignacio V.", 4, 2, 11], ["Sebastián L.", 5, 1, 10],
    ["Antonia F.", 4, 1, 8], ["Vicente C.", 3, 0, 5], ["Martina G.", 2, 0, 3],
  ],
  "Yu-Gi-Oh!": [
    ["Felipe G.", 3, 2, 12], ["Joaquín B.", 3, 2, 11], ["Valentina H.", 3, 1, 9], ["Cristóbal N.", 2, 1, 7],
    ["Agustín E.", 3, 0, 6], ["Fernanda D.", 2, 1, 6], ["Lucas Q.", 2, 0, 4], ["Maximiliano Z.", 1, 0, 2],
  ],
};
const LIGAS_ACTUALIZADO = "Actualizado después de la última fecha";
const CLASIFICAN = 8; // los primeros N juegan la final de liga

const CAMPEONES = [
  { nombre: "Matías R.", torneo: "Liga Pokémon TCG · Fecha 5", cuando: "Sábado pasado" },
  { nombre: "Felipe G.", torneo: "Liga Yu-Gi-Oh! · Fecha 3", cuando: "Hace 2 semanas" },
  { nombre: "Camila S.", torneo: "Torneo One Piece", cuando: "Hace 3 semanas" },
];
