(function () {
  const iframe = document.createElement("iframe");
  iframe.src = "https://widget-rag.vercel.app";
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "400px";
  iframe.style.height = "600px";
  iframe.style.border = "none";
  iframe.style.zIndex = "9999";
  iframe.style.borderRadius = "15px";
  iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
  iframe.id = "chatbot-widget";

  document.body.appendChild(iframe);
})();






