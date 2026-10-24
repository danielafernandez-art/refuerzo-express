# Refuerzo Express - Sitio web

Micro-clases virtuales de matemáticas de 30 minutos para estudiantes de bachillerato.
Proyecto académico CUN 2026: Daniela Fernandez y Luis Cartagena.

## Archivos
- index.html: inicio (hero, beneficios, pasos, tabla comparativa, calculadora de ahorro, video)
- servicios.html: temas, tabla por grado, mini quiz y formulario de opiniones
- contacto.html: formulario para agendar la clase, horarios, video y preguntas frecuentes
- estilos.css: todos los estilos (Flexbox, animaciones y 3 media queries)
- script.js: menú, calculadora, validación y envío de formularios, quiz
- img/: imágenes propias del proyecto
- fuentes/: tipografías Gochi Hand y Poppins (licencia SIL Open Font License)

## Cómo se guardan los registros
Los dos formularios envían los datos con una petición POST al servicio gratuito FormSubmit,
que los manda al correo configurado en la primera línea de script.js (CORREO_DESTINO).
La PRIMERA vez que alguien envía un formulario, FormSubmit manda un correo de activación:
hay que abrirlo y confirmar. Desde ahí, cada registro llega al correo.

## Cómo se miden las visitas
El sitio está publicado en GitHub Pages: https://danielafernandez-art.github.io/refuerzo-express/
script.js carga GoatCounter (gratuito, sin cookies), que registra cada visita.
Las estadísticas se ven en https://refuerzoexpress.goatcounter.com (visitantes únicos,
páginas vistas, país, dispositivo y de dónde llegaron). Se pueden exportar a CSV
desde Settings > Export para el informe del plan de negocio.
