import { StringBuilder } from './stringbuilder.js';
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

    analizarTexto(texto) { // 1.1
        const tokens = [];
        let lineaActual = 1;
        let columnaActual = 1;
        let estado = 'q0'; // q3
        let sb = new StringBuilder(); // 1.
        let nuevoToken = false;
        let decimal = false;

        for (let i = 0; i <= texto.length; i++) { // 3

            // Pasar al caracter anterior en q0
            if(nuevoToken){
                i--;
                nuevoToken = false;
            }

            const char = texto[i]; // 

            // Salto de linea
            if (char === '\n') {
                lineaActual++;
                columnaActual = 1;
            }

            //Lexer

            if(estado == 'q0'){
                if(this.esLetra(char)){
                    estado = 'q1';
                    sb.append(char);
                }else if(this.esNumero(char)){
                    estado = 'q2';
                    sb.append(char);
                }
            }else if(estado == 'q1'){
                if(!(this.esLetra(char) || this.esNumero(char))){
                    tokens.push(new Token(sb.toString(), this.TokenTypes.IDENTIFICADOR, lineaActual, columnaActual))
                    sb.clear();
                    estado = 'q0';
                    columnaActual++;
                    nuevoToken = true;
                }else{
                    sb.append(char);
                }
            }else if(estado == 'q2'){
                if(char === '.'){
                    estado = 'q3';
                    sb.append(char);
                }else if(!(this.esNumero(char))){
                    tokens.push(new Token(sb.toString(), this.TokenTypes.NUMERO, lineaActual, columnaActual))
                    sb.clear();
                    estado = 'q0';
                    columnaActual++;
                    nuevoToken = true;
                }else {
                    sb.append(char);
                }
            }else if(estado == 'q3'){
                
                if(!(this.esNumero(char))){
                    if(decimal){
                        tokens.push(new Token(sb.toString(), this.TokenTypes.DECIMAL, lineaActual, columnaActual))
                        sb.clear();
                        estado = 'q0';
                        columnaActual++;
                        nuevoToken = true;
                        decimal = false;
                    }
                }else{
                    sb.append(char);
                    decimal = true;
                }
            }

            //
            
        }

        this.imprimirTokens(tokens);

        return tokens;
    }

    imprimirTokens(tokens){
        tokens.forEach(token => {
            console.log(`Token: ${token.valor}, ${token.tipo}, ${token.linea}, ${token.columna}`);
        });
    }

    esLetra(caracter) {
        if(caracter == undefined){return false}
        let codigo = caracter.charCodeAt(0);
        return (codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122);
    }

    esNumero(caracter) {
        if(caracter == undefined){return false}
        let codigo = caracter.charCodeAt(0);
        return codigo >= 48 && codigo <= 57;
    }
}

