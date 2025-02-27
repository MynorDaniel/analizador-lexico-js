import { Automata } from "./backend/automata.js";

let tokens = [];

document.getElementById('open-btn').addEventListener('click', () => {
    // Funcionalidad para abrir un archivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('text-area').value = reader.result;
      };
      reader.readAsText(file);
    };
    input.click();
  });

  document.getElementById('download-btn').addEventListener('click', () => {
    // Funcionalidad para descargar el contenido
    const text = document.getElementById('text-area').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'codigo.txt';
    link.click();
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    // Limpiar el área de texto
    document.getElementById('text-area').value = '';
    document.getElementById('output').textContent = ''; // Limpiar la salida
  });

  document.getElementById('analyze-btn').addEventListener('click', () => {
    // Función de análisis léxico
    const texto = document.getElementById('text-area').value;
    tokens = analizarTexto(texto);
    document.getElementById('output').textContent = `Análisis completo: ${tokens.length} tokens`;
  });

  function analizarTexto(texto){
    let automata = new Automata();
    return automata.analizarTexto(texto);
  }