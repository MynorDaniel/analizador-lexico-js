import { Automata } from "./backend/automata.js";

let tokens = [];

// Funcionalidad para abrir un archivo
document.getElementById('open-btn').addEventListener('click', () => {

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

  // Funcionalidad para descargar el contenido
  document.getElementById('download-btn').addEventListener('click', () => {
    
    const textArea = document.getElementById("text-area");
    const text = textArea.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'codigo.txt';
    link.click();
  });

  // Limpiar el área de texto
  document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById("text-area").innerHTML = '';
    document.getElementById('output').textContent = '';
  });

  // Analizar texto
  document.getElementById('analyze-btn').addEventListener('click', () => {
    const textDiv = document.getElementById("text-area");
    const texto = textDiv.innerText;
    tokens = analizarTexto(texto);
    document.getElementById('output').textContent = `Análisis completo: ${tokens.length} tokens`;
  });

  // Generar tokens
  function analizarTexto(texto){
    let automata = new Automata();
    return automata.analizarTexto(texto);
  }

  // Busqueda de patrones
  document.getElementById("search-btn").addEventListener("click", () => {
    const palabra = document.getElementById("pattern-input").value.trim();
    buscarPatrones(palabra);
  });

  function buscarPatrones(palabra) {
    const textArea = document.getElementById("text-area");
    const textoOriginal = textArea.innerText;
    
    const regex = new RegExp(`(${palabra})`, "gi");
  
    let coincidencias = 0;
    let resultado;
    
    while ((resultado = regex.exec(textoOriginal)) !== null) {
      coincidencias++;
    }
    const nuevoHTML = textoOriginal.replace(regex, '<span style="background-color: red;">$1</span>');
    textArea.innerHTML = nuevoHTML;

    document.getElementById('output').textContent = `Cadena: ${palabra}    Coincidencias: ${coincidencias}`;
  }
  

  
  