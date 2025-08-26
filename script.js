const frasesPensando = [
  "🛢️ Abriendo la solera...",
  "🍇 Catando el vino...",
  "🍷 Decantando la mejor respuesta..."
];

let pensandoInterval;

function sanitizar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

async function enviarWebhook() {
  const textarea = document.getElementById('userMessage');
  const mensajeRaw = textarea.value.trim();
  if (!mensajeRaw) return;

  const mensaje = mensajeRaw;
  const intro = document.getElementById('intro');
  const pensando = document.getElementById('pensando');
  const resultado = document.getElementById('resultado');
  const encuesta = document.getElementById('enlace-encuesta');
  const pregunta = document.getElementById('pregunta-usuario');
  const boton = document.getElementById('enviar');

  boton.disabled = true;
  encuesta.innerHTML = "";
  resultado.style.display = "none";
  resultado.innerHTML = "";

  intro.style.display = "none";
  pregunta.style.display = "block";
  pregunta.textContent = mensaje;

  let index = 0;
  pensando.style.display = "block";
  pensando.innerHTML = `
    <span class="educado">Por favor, mantente a la espera. Disculpa la demora.</span>
    <span id="frase-rotatoria" class="frase"></span>
  `;
  const rotatoria = document.getElementById('frase-rotatoria');
  rotatoria.textContent = frasesPensando[index];

  pensandoInterval = setInterval(() => {
    index = (index + 1) % frasesPensando.length;
    rotatoria.textContent = frasesPensando[index];
  }, 6000);

  try {
    const response = await fetch("https://1b80220eed45.ngrok-free.app/webhook/rag-widget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "header": "MI_SECRET_HEADER"
      },
      body: JSON.stringify({
        chatInput: mensaje,
        sessionId: "12345"
      })
    });

    const rawText = await response.text();

    clearInterval(pensandoInterval);
    pensandoInterval = null;
    pensando.innerHTML = "";
    pensando.style.display = "none";

    const safe = sanitizar(rawText).replace(/\n/g, "<br>");
    resultado.innerHTML = safe;
    resultado.style.display = "block";
    pregunta.textContent = "La información devuelta es posible que esté desactualizada a día de hoy";

    const enlaceEncuesta = `
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSffcgLsrBfUkZ2xY5amLMbb-CyKKzkSMQbx1Xsgrde0zZwP7Q/viewform?usp=dialog" target="_blank">
        Déjanos tu opinión completando esta encuesta
      </a>
    `;
    encuesta.innerHTML = enlaceEncuesta;

  } catch (error) {
    clearInterval(pensandoInterval);
    pensandoInterval = null;
    pensando.innerHTML = "";
    pensando.style.display = "none";

    resultado.textContent = "Error: " + error.message;
    resultado.style.display = "block";
  } finally {
    boton.disabled = false;
    textarea.value = "";
  }
}

