// Frases temáticas de espera
const frasesPensando = [
  "🛢️ Abriendo la solera...",
  "🍇 Catando el vino...",
  "🍷 Decantando la mejor respuesta..."
];

let pensandoInterval;

async function enviarWebhook() {
  const mensaje = document.getElementById('userMessage').value;
  const pensando = document.getElementById('pensando');
  const resultado = document.getElementById('resultado');
  const encuesta = document.getElementById('enlace-encuesta');

  resultado.style.display = "none";
  resultado.innerHTML = "";
  encuesta.innerHTML = "";
  pensando.style.display = "block";

  // Inicia rotación de frases
  let index = 0;
  pensando.innerText = frasesPensando[index];
  pensandoInterval = setInterval(() => {
    index = (index + 1) % frasesPensando.length;
    pensando.innerText = frasesPensando[index];
  }, 3000); 

  try {
    const response = await fetch("http://a22.uca.es:5678/webhook/rag-widget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatInput: mensaje,
        sessionId: "12345"
      })
    });

    const data = await response.text();

    resultado.innerHTML = data.replace(/\n/g, '<br>');
    resultado.style.display = "block";

    const enlaceEncuesta = `
      <div style="margin-top: 1.5em;">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSffcgLsrBfUkZ2xY5amLMbb-CyKKzkSMQbx1Xsgrde0zZwP7Q/viewform?usp=dialog" 
           target="_blank"
           style="background-color: #ffeecc; padding: 0.8em 1.2em; text-decoration: none; color: #3d2b1f; border-radius: 10px; font-weight: 600; box-shadow: 0 3px 6px rgba(0,0,0,0.1);">
           Déjanos tu opinión completando la siguiente encuesta:
        </a>
      </div>
    `;
    encuesta.innerHTML = enlaceEncuesta;

  } catch (error) {
    resultado.innerText = 'Error: ' + error.message;
    resultado.style.display = "block";
  } finally {
    clearInterval(pensandoInterval);
    pensando.innerText = "";
    pensando.style.display = "none";
  }
}