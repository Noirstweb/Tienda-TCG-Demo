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
