/* =========================================================
   Refuerzo Express - script.js
   Programación del lado del cliente (JavaScript)
   ========================================================= */

/* ----- Configuración general ----- */
// Correo donde llegan los registros de los formularios (servicio FormSubmit).
const CORREO_DESTINO = "daniela.fernandez@cun.edu.co";
// Precio de una micro-clase en pesos colombianos.
const PRECIO_CLASE = 15000;


/* =========================================================
   1. MENÚ HAMBURGUESA (pantallas pequeñas)
   ========================================================= */
const botonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
        menu.classList.toggle("abierto");
        // Avisamos a lectores de pantalla si el menú está abierto o cerrado
        const abierto = menu.classList.contains("abierto");
        botonMenu.setAttribute("aria-expanded", abierto);
        botonMenu.textContent = abierto ? "✕" : "☰";
    });
}


/* =========================================================
   2. FUNCIONES DE APOYO PARA VALIDAR FORMULARIOS
   ========================================================= */

// Muestra un mensaje de error debajo del campo y lo marca en rojo
function mostrarError(idCampo, texto) {
    const mensaje = document.getElementById("error-" + idCampo);
    const campo = document.getElementById(idCampo);
    if (mensaje) mensaje.textContent = texto;
    if (campo) campo.classList.add("campo-invalido");
}

// Borra el mensaje de error de un campo
function limpiarError(idCampo) {
    const mensaje = document.getElementById("error-" + idCampo);
    const campo = document.getElementById(idCampo);
    if (mensaje) mensaje.textContent = "";
    if (campo) campo.classList.remove("campo-invalido");
}

// Muestra el mensaje general del formulario (cargando, éxito o fallo)
function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = "mensaje " + tipo;
}

// Envía los datos al correo con una petición POST (servicio FormSubmit)
async function enviarDatos(datos) {
    const respuesta = await fetch("https://formsubmit.co/ajax/" + CORREO_DESTINO, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(datos)
    });
    if (!respuesta.ok) {
        throw new Error("El servidor respondió con error " + respuesta.status);
    }
    return respuesta.json();
}


/* =========================================================
   3. CALCULADORA DE AHORRO (index.html)
   Usa operadores aritméticos (*, -, /), lógicos (&&, ||, !)
   y condiciones if / else.
   ========================================================= */
const formCalculadora = document.getElementById("formCalculadora");

if (formCalculadora) {
    // Calcula al presionar el botón y también mientras la persona escribe
    formCalculadora.addEventListener("submit", function (evento) {
        evento.preventDefault();   // evita que la página se recargue
        calcularAhorro();
    });
    formCalculadora.addEventListener("input", calcularAhorro);

    function calcularAhorro() {

        const clases = Number(document.getElementById("numClases").value);
        const mensualidad = Number(document.getElementById("mensualidad").value);
        const salida = document.getElementById("resultadoCalculadora");

        limpiarError("numClases");
        limpiarError("mensualidad");

        // Caso de error 1: campos vacíos o que no son números enteros
        if (!Number.isInteger(clases) || clases < 1 || clases > 20) {
            mostrarError("numClases", "Escribe un número de clases entre 1 y 20.");
            salida.innerHTML = "<p>Revisa el número de clases.</p>";
            return;
        }

        // Caso de error 2: mensualidad vacía, negativa o demasiado baja
        if (mensualidad <= 0 || mensualidad < 1000 || isNaN(mensualidad)) {
            mostrarError("mensualidad", "Escribe una mensualidad válida, por ejemplo 180000.");
            salida.innerHTML = "<p>Revisa el valor de la mensualidad.</p>";
            return;
        }

        // Cálculos con operadores aritméticos
        const costoNuestro = clases * PRECIO_CLASE;
        const ahorro = mensualidad - costoNuestro;
        const porcentaje = Math.round((ahorro / mensualidad) * 100);

        // Formato de pesos colombianos
        const pesos = (valor) => "$" + valor.toLocaleString("es-CO");

        // Condición principal: ¿ahorras o no?
        if (ahorro > 0 && porcentaje >= 30) {
            salida.innerHTML =
                "<p>Con nosotros pagas <strong>" + pesos(costoNuestro) + "</strong> este mes.</p>" +
                "<p class='cifra'>Ahorras " + pesos(ahorro) + "</p>" +
                "<p>Eso es un <strong>" + porcentaje + "%</strong> menos que la academia. 🎉</p>";
        } else if (ahorro > 0 || ahorro === 0) {
            salida.innerHTML =
                "<p>Con nosotros pagas <strong>" + pesos(costoNuestro) + "</strong>.</p>" +
                "<p class='cifra'>Ahorras " + pesos(ahorro) + "</p>" +
                "<p>Y además eliges tu horario y no te desplazas.</p>";
        } else {
            salida.innerHTML =
                "<p>Para " + clases + " clases al mes, una academia puede salirte más barata.</p>" +
                "<p class='cifra'>" + pesos(costoNuestro) + "</p>" +
                "<p>Refuerzo Express es ideal cuando necesitas pocas clases puntuales antes de un examen.</p>";
        }
    }

    calcularAhorro();   // primer cálculo con los valores de ejemplo
}


/* =========================================================
   4. FORMULARIO 1: AGENDAR CLASE (contacto.html)
   ========================================================= */
const formAgenda = document.getElementById("formAgenda");

if (formAgenda) {
    const campoFecha = document.getElementById("fechaExamen");
    const avisoFecha = document.getElementById("avisoFecha");

    // La fecha mínima del examen es hoy (formato AAAA-MM-DD)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    campoFecha.min = hoy.getFullYear() + "-" + mes + "-" + dia;

    // Al elegir la fecha, calculamos cuántos días faltan
    campoFecha.addEventListener("change", function () {
        const fecha = new Date(campoFecha.value + "T00:00:00");
        const dias = Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
        if (dias === 0) {
            avisoFecha.textContent = "¡Es hoy! Te contactamos de inmediato.";
        } else if (dias > 0 && dias <= 3) {
            avisoFecha.textContent = "Faltan " + dias + " días: te damos prioridad.";
        } else if (dias > 3) {
            avisoFecha.textContent = "Faltan " + dias + " días: hay tiempo para practicar con calma.";
        }
    });

    formAgenda.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        let valido = true;

        // Limpiamos los errores anteriores
        ["nombre", "whatsapp", "grado", "tema", "fechaExamen", "quienLlena", "autorizo"].forEach(limpiarError);

        // Nombre: obligatorio y solo letras
        const nombre = document.getElementById("nombre");
        if (nombre.value.trim() === "") {
            mostrarError("nombre", "Escribe el nombre del estudiante.");
            valido = false;
        } else if (!nombre.checkValidity()) {
            mostrarError("nombre", "Usa solo letras (mínimo 3).");
            valido = false;
        }

        // WhatsApp: 10 dígitos que empiezan por 3
        const whatsapp = document.getElementById("whatsapp");
        if (!whatsapp.checkValidity()) {
            mostrarError("whatsapp", "Escribe un celular de 10 dígitos que empiece por 3.");
            valido = false;
        }

        // Grado: entre 6 y 11
        const grado = Number(document.getElementById("grado").value);
        if (grado < 6 || grado > 11 || !Number.isInteger(grado)) {
            mostrarError("grado", "El grado debe estar entre 6 y 11.");
            valido = false;
        }

        // Tema: debe elegir uno
        const tema = document.getElementById("tema");
        if (tema.value === "") {
            mostrarError("tema", "Elige el tema que quieres reforzar.");
            valido = false;
        }

        // Fecha: obligatoria y no puede ser en el pasado
        if (campoFecha.value === "" || !campoFecha.checkValidity()) {
            mostrarError("fechaExamen", "Elige una fecha de hoy en adelante.");
            valido = false;
        }

        // Quién llena: debe marcar una opción
        const quien = formAgenda.querySelector("input[name='quienLlena']:checked");
        if (!quien) {
            mostrarError("quienLlena", "Marca quién llena el formulario.");
            valido = false;
        }

        // Autorización: es obligatoria
        const autorizo = document.getElementById("autorizo");
        if (!autorizo.checked) {
            mostrarError("autorizo", "Necesitamos tu autorización para escribirte.");
            valido = false;
        }

        const mensaje = document.getElementById("mensajeAgenda");

        // Si algo está mal, no enviamos
        if (!valido) {
            mostrarMensaje(mensaje, "Revisa los campos marcados en rojo.", "fallo");
            return;
        }

        // Si todo está bien, enviamos los datos con POST
        mostrarMensaje(mensaje, "Enviando tu solicitud...", "cargando");
        try {
            await enviarDatos({
                _subject: "Nueva clase agendada - Refuerzo Express",
                formulario: "Agendar clase",
                nombre: nombre.value.trim(),
                whatsapp: whatsapp.value,
                grado: grado,
                tema: tema.value,
                fechaExamen: campoFecha.value,
                quienLlena: quien.value
            });
            mostrarMensaje(mensaje, "¡Listo, " + nombre.value.trim() + "! Te escribiremos por WhatsApp para confirmar tu clase.", "exito");
            formAgenda.reset();
            avisoFecha.textContent = "Así priorizamos tu clase.";
        } catch (error) {
            mostrarMensaje(mensaje, "No se pudo enviar. Revisa tu conexión a internet e inténtalo de nuevo.", "fallo");
        }
    });
}


/* =========================================================
   5. FORMULARIO 2: OPINIONES (servicios.html)
   Preguntas de validación del plan de negocio
   ========================================================= */
const formOpinion = document.getElementById("formOpinion");

if (formOpinion) {
    // Contador de caracteres del campo "¿Qué cambiarías?"
    const cambiaria = document.getElementById("cambiaria");
    const contador = document.getElementById("contador");
    cambiaria.addEventListener("input", function () {
        contador.textContent = cambiaria.value.length;
    });

    formOpinion.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        let valido = true;
        ["rol", "comoResuelve", "pagaria", "leGusta", "cambiaria"].forEach(limpiarError);

        const rol = formOpinion.querySelector("input[name='rol']:checked");
        if (!rol) {
            mostrarError("rol", "Marca una opción.");
            valido = false;
        }

        const comoResuelve = document.getElementById("comoResuelve");
        if (comoResuelve.value === "") {
            mostrarError("comoResuelve", "Elige una opción.");
            valido = false;
        }

        const pagaria = document.getElementById("pagaria");
        const valor = Number(pagaria.value);
        if (pagaria.value === "" || valor < 0 || valor > 100000) {
            mostrarError("pagaria", "Escribe un valor entre 0 y 100.000.");
            valido = false;
        }

        const leGusta = document.getElementById("leGusta");
        if (leGusta.value === "") {
            mostrarError("leGusta", "Elige una opción.");
            valido = false;
        }

        if (cambiaria.value.trim().length < 3) {
            mostrarError("cambiaria", "Cuéntanos al menos una idea.");
            valido = false;
        }

        const mensaje = document.getElementById("mensajeOpinion");
        if (!valido) {
            mostrarMensaje(mensaje, "Revisa los campos marcados en rojo.", "fallo");
            return;
        }

        mostrarMensaje(mensaje, "Enviando tu opinión...", "cargando");
        try {
            await enviarDatos({
                _subject: "Nueva opinión - Refuerzo Express",
                formulario: "Opinión",
                rol: rol.value,
                comoResuelveHoy: comoResuelve.value,
                cuantoPagaria: valor,
                loQueMasGusta: leGusta.value,
                queCambiaria: cambiaria.value.trim(),
                recomendaria: document.getElementById("recomendaria").checked ? "Sí" : "No"
            });
            mostrarMensaje(mensaje, "¡Gracias! Tu opinión nos ayuda a mejorar.", "exito");
            formOpinion.reset();
            contador.textContent = "0";
        } catch (error) {
            mostrarMensaje(mensaje, "No se pudo enviar. Revisa tu conexión a internet e inténtalo de nuevo.", "fallo");
        }
    });
}


/* =========================================================
   6. MINI QUIZ (servicios.html)
   ========================================================= */
const quiz = document.getElementById("quiz");

if (quiz) {
    const preguntas = [
        { texto: "Si 3x = 12, ¿cuánto vale x?", opciones: ["3", "4", "9"], correcta: "4" },
        { texto: "¿Cuánto es el 20% de 50.000?", opciones: ["5.000", "10.000", "20.000"], correcta: "10.000" },
        { texto: "Factoriza: x² − 9", opciones: ["(x−3)²", "(x+3)(x−3)", "(x+9)(x−1)"], correcta: "(x+3)(x−3)" }
    ];
    let actual = 0;
    let puntos = 0;

    const textoPregunta = document.getElementById("quizPregunta");
    const cajaOpciones = document.getElementById("quizOpciones");
    const progreso = document.getElementById("quizProgreso");
    const mensajeQuiz = document.getElementById("quizMensaje");

    function mostrarPregunta() {
        const p = preguntas[actual];
        progreso.textContent = "Pregunta " + (actual + 1) + " de " + preguntas.length;
        textoPregunta.textContent = p.texto;
        mensajeQuiz.textContent = "";
        cajaOpciones.innerHTML = "";

        p.opciones.forEach(function (opcion) {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = opcion;
            boton.addEventListener("click", function () { responder(boton, opcion); });
            cajaOpciones.appendChild(boton);
        });
    }

    function responder(boton, opcion) {
        const p = preguntas[actual];
        // Bloqueamos los botones para que no responda dos veces
        cajaOpciones.querySelectorAll("button").forEach(b => b.disabled = true);

        if (opcion === p.correcta) {
            puntos = puntos + 1;
            boton.classList.add("correcta");
            mensajeQuiz.textContent = "¡Correcto!";
        } else {
            boton.classList.add("incorrecta");
            mensajeQuiz.textContent = "Casi. La respuesta era " + p.correcta + ".";
        }

        // Pasamos a la siguiente pregunta o mostramos el resultado
        setTimeout(function () {
            actual = actual + 1;
            if (actual < preguntas.length) {
                mostrarPregunta();
            } else {
                mostrarResultado();
            }
        }, 1300);
    }

    function mostrarResultado() {
        progreso.textContent = "Resultado";
        cajaOpciones.innerHTML = "";
        if (puntos === preguntas.length) {
            textoPregunta.textContent = "¡" + puntos + " de 3! Vas muy bien preparado.";
            mensajeQuiz.textContent = "Si te queda alguna duda puntual, agenda una clase corta para afinar.";
        } else {
            textoPregunta.textContent = puntos + " de 3. Una micro-clase te puede ayudar.";
            mensajeQuiz.innerHTML = "<a class='btn btn-principal' href='contacto.html'>Agenda tu clase</a>";
        }
        const otraVez = document.createElement("button");
        otraVez.type = "button";
        otraVez.textContent = "Intentar de nuevo";
        otraVez.addEventListener("click", function () {
            actual = 0;
            puntos = 0;
            mostrarPregunta();
        });
        cajaOpciones.appendChild(otraVez);
    }

    mostrarPregunta();
}


/* =========================================================
   7. CONTADOR DE VISITAS (GoatCounter, funciona en GitHub Pages)
   Cada vez que alguien abre una página se registra una visita
   en el panel https://refuerzoexpress.goatcounter.com
   No usa cookies ni guarda datos personales.
   ========================================================= */
const CODIGO_GOATCOUNTER = "refuerzoexpress";

// Solo cuenta en el sitio publicado, no al abrir los archivos en el computador.
if (location.protocol.startsWith("http") && location.hostname !== "localhost") {
    const contador = document.createElement("script");
    contador.async = true;
    contador.src = "https://gc.zgo.at/count.js";
    contador.dataset.goatcounter = "https://" + CODIGO_GOATCOUNTER + ".goatcounter.com/count";
    document.head.appendChild(contador);
}
