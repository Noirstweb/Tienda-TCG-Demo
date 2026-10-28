# Tienda TCG genérica — maqueta demo (Noirstweb)

Maqueta para ofrecer a tiendas de cartas coleccionables. Solo HTML, CSS y JS: se abre con doble clic en `index.html`.

## Páginas
- `index.html` — Inicio: banner con promos, beneficios, categorías por juego, destacados con pestañas, preventas, cómo comprar y horario.
- `productos.html` — Catálogo con filtros por juego, tipo, búsqueda, orden y "solo con stock".
- `ofertas.html` — Ofertas con cuenta regresiva, filtro por juego y combo del mes.
- `torneos.html` — Próximo torneo con cuenta regresiva, calendario con cupos e inscripción por WhatsApp, tabla de la liga con buscador de jugador y últimos campeones.

Todas tienen: horario abierto/cerrado siempre visible arriba a la derecha, modo oscuro, carro de compras (se guarda en el navegador y envía el pedido por WhatsApp), menú hamburguesa en celular, vista rápida de producto y botón flotante de WhatsApp.

## Personalizar sin tocar código (para mandar a cada tienda)
Agrega parámetros al link:

```
https://noirstweb.github.io/Tienda-TCG-Demo/?tienda=Planeta%20Titan&color=0ea5e9&ciudad=Talca&ig=planeta.titan&wa=56912345678
```

| Parámetro | Qué cambia |
|---|---|
| `tienda` | Nombre de la tienda (espacios como `%20`) |
| `color` | Color de marca en hexadecimal, sin `#` |
| `ciudad` | Ciudad que aparece en retiro y dirección |
| `ig` | Usuario de Instagram |
| `wa` | WhatsApp (solo números, con 56) |

La personalización se mantiene al navegar entre páginas.

## Editar datos fijos
Todo está en `js/config.js`: datos de la tienda, horario, avisos, banners, categorías, productos, fecha de término de las ofertas, torneos, ligas y campeones.

## Tabla de la liga desde Google Sheets (opcional)
La tienda puede actualizar la tabla sin tocar código:
1. Crear una hoja con columnas `liga, nombre, fechas, victorias, puntos`.
2. Archivo → Compartir → Publicar en la web → formato CSV.
3. Pegar ese link en `LIGAS_CSV` dentro de `js/config.js`.

Si el link falla, la página muestra los datos de `LIGAS`.
Para usar fotos reales, reemplaza la función `arte()` en `js/app.js` por una etiqueta `<img>`.
