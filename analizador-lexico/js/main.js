import { Automata } from "./backend/automata.js";

let tokens = [];
let errores = [];

// Funcionalidad para abrir un archivo
document.getElementById('open-btn').addEventListener('click', () => {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('text-area').innerText = reader.result;
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
    let resultado = analizarTexto(texto);
    tokens = resultado[0];
    errores = resultado[1];
    document.getElementById('output').textContent = `Análisis completo: ${tokens.length} tokens`;
    mostrarReportes();
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

  // Resaltar coincidencias
  function buscarPatrones(palabra) {
    const textArea = document.getElementById("text-area");
    const textoOriginal = textArea.innerText;
    
    let coincidencias = 0;
    let nuevoHTML = "";
    let i = 0;

    while (i < textoOriginal.length) {
        let coincide = true;

        for (let j = 0; j < palabra.length; j++) {
            if (textoOriginal[i + j]?.toLowerCase() !== palabra[j].toLowerCase()) {
                coincide = false;
                break;
            }
        }

        if (coincide) {
            nuevoHTML += `<span style="background-color: red;">${textoOriginal.slice(i, i + palabra.length)}</span>`;
            coincidencias++;
            i += palabra.length;
        } else {
            nuevoHTML += textoOriginal[i];
            i++;
        }
    }

    textArea.innerHTML = nuevoHTML;
    document.getElementById('output').textContent = `Cadena: ${palabra}    Coincidencias: ${coincidencias}`;
}

  
  
  // Llenar las tablas
  function mostrarReportes() {
    // Mostrar los tokens
    const tablaTokens = document.getElementById("tabla-tokens").getElementsByTagName("tbody")[0];
    tablaTokens.innerHTML = '';

    tokens.forEach(token => {
      const fila = tablaTokens.insertRow();
      fila.insertCell(0).textContent = token.tipo;
      fila.insertCell(1).textContent = token.valor;
      fila.insertCell(2).textContent = token.columna;
      fila.insertCell(3).textContent = token.linea;
    });

    // Mostrar los errores
    const tablaErrores = document.getElementById("tabla-errores").getElementsByTagName("tbody")[0];
    tablaErrores.innerHTML = ''; 

    errores.forEach(error => {
      const fila = tablaErrores.insertRow();
      fila.classList.add("error-row"); 
      fila.insertCell(0).textContent = error.valor;
      fila.insertCell(1).textContent = error.columna;
      fila.insertCell(2).textContent = error.linea;
    });
    
    contarLexemas();
  }

  // Conteo de lexemas
  function contarLexemas(){
    const tablaConteo = document.getElementById("tabla-conteo").getElementsByTagName("tbody")[0];
    tablaConteo.innerHTML = '';

    if(errores == 0){
      let conteoObj = contarTokens(tokens);

      Object.keys(conteoObj).forEach(lexema => {
        const fila = tablaConteo.insertRow();
        fila.insertCell(0).textContent = lexema;
        fila.insertCell(1).textContent = conteoObj[lexema];
      });
    }

  }
  
  function contarTokens(tokens) {
    const conteo = {};
    
    tokens.forEach(token => {
      if (conteo[token.valor]) {
        conteo[token.valor]++;
      } else {
        conteo[token.valor] = 1;
      }
    });
  
    return conteo;
  }
  