import { Token } from './token.js';

export class Automata {

  constructor() {
    this.TokenTypes = {
        NUMERO: 'Número',
        IDENTIFICADOR: 'Identificador',
        DECIMAL: 'Decimal',
        PUNTUACION: 'Puntuación',
        OPERADOR_ARITMETICO: 'Operador Aritmético',
        OPERADOR_LOGICO: 'Operador Lógico',
        OPERADOR_RELACIONAL: 'Operador Relacional',
        ASIGNACION: 'Asignación',
        AGRUPACION: 'Agrupación'
    };
  }

    analizarTexto(texto) {
        const tokens = [];
        let lineaActual = 1;
        let columnaActual = 1;
        let charActual = 0;

        for (let i = 0; i < texto.length; i++) {
            const char = texto[i];

            // Salto de linea
            if (char === '\n') {
                lineaActual++;
                columnaActual = 1;
            } else {
                columnaActual++;
            }

            //Logica lexer

            charActual++;
        }

        this.imprimirTokens(tokens);

        return tokens;
    }

    imprimirTokens(tokens){
        tokens.forEach(token => {
            console.log(`Token: ${token.valor}, ${token.tipo}, ${token.linea}, ${token.columna}`);
        });
    }

}

