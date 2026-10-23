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
Si el sitio se publica en Vercel, script.js carga Vercel Web Analytics automáticamente.
Hay que activarlo una vez en el panel de Vercel: proyecto > Analytics > Enable.
