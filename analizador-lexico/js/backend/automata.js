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
        AGRUPACION: 'Agrupación',
        ERROR: 'Error'
    };
  }

    analizarTexto(texto) { // &&&

        const tokens = [];
        const errores = [];
        let lineaActual = 1;
        let columnaActual = 1;
        let estado = 'q0'; // q0
        let sb = new StringBuilder(); // 
        let nuevoToken = false;
        let decimal = false;
        let actualOpLogico = '';

        for (let i = 0; i <= texto.length; i++) { // 1

            // Pasar al caracter anterior en q0
            if(nuevoToken){
                i--;
                nuevoToken = false;
            }

            const char = texto[i]; // &

            // Salto de linea
            if (char === '\n') {
                lineaActual++;
                columnaActual = 1;
            }

            //Estados
            ///////////////////////////////////
            if(estado == 'q0'){
                if(this.esLetra(char)){
                    estado = 'q1';
                    sb.append(char);
                }else if(this.esNumero(char)){
                    estado = 'q2';
                    sb.append(char);
                }else if(this.esPuntuacion(char)){
                    estado = 'q4';
                    sb.append(char);
                }else if(this.esAritmetico(char)){
                    estado = 'q5';
                    sb.append(char);
                }else if(this.esLogico(char)){
                    estado = 'q6';
                    sb.append(char);
                    actualOpLogico = char;
                }else if(char === '='){
                    estado = 'q7';
                    sb.append(char);
                }else if(this.esAgrupacion(char)){
                    estado = 'q8';
                    sb.append(char);
                }else if(this.esRelacional(char)){
                    estado = 'q10';
                    sb.append(char);
                }else if((typeof char) !== "undefined"){
                    if(!(this.esEspacio(char))){
                        errores.push(new Token(char, this.TokenTypes.ERROR, lineaActual, columnaActual))
                    }
                }
            ///////////////////////////////////
            }else if(estado == 'q1'){
                if(!(this.esLetra(char) || this.esNumero(char))){
                    // Posible operador logico
                    if(sb.toString().toLowerCase() === 'or' || sb.toString().toLowerCase() === 'and'){
                        tokens.push(new Token(sb.toString(), this.TokenTypes.OPERADOR_LOGICO, lineaActual, columnaActual))
                    }else{
                        tokens.push(new Token(sb.toString(), this.TokenTypes.IDENTIFICADOR, lineaActual, columnaActual))
                    }
                    sb.clear();
                    estado = 'q0';
                    columnaActual++;
                    nuevoToken = true;
                }else{
                    sb.append(char);
                }
            ///////////////////////////////////
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
            ///////////////////////////////////
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
            ///////////////////////////////////
            }else if(estado == 'q4'){
                tokens.push(new Token(sb.toString(), this.TokenTypes.PUNTUACION, lineaActual, columnaActual))
                sb.clear();
                estado = 'q0';
                columnaActual++;
                nuevoToken = true;
            ///////////////////////////////////
            }else if(estado == 'q5'){
                tokens.push(new Token(sb.toString(), this.TokenTypes.OPERADOR_ARITMETICO, lineaActual, columnaActual))
                sb.clear();
                estado = 'q0';
                columnaActual++;
                nuevoToken = true;
            ///////////////////////////////////
            }else if(estado == 'q6'){
                if(actualOpLogico === char){
                    tokens.push(new Token(char+char, this.TokenTypes.OPERADOR_LOGICO, lineaActual, columnaActual))
                    sb.clear();
                    estado = 'q0';
                    columnaActual++;
                }else{
                    if(!(char === '\s+')){
                        errores.push(new Token(sb.toString(), this.TokenTypes.ERROR, lineaActual, columnaActual))
                    }
                }
            ///////////////////////////////////
            }else if(estado == 'q7'){
                tokens.push(new Token(sb.toString(), this.TokenTypes.ASIGNACION, lineaActual, columnaActual))
                sb.clear();
                estado = 'q0';
                columnaActual++;
                nuevoToken = true;
            ///////////////////////////////////
            }else if(estado == 'q8'){
                tokens.push(new Token(sb.toString(), this.TokenTypes.AGRUPACION, lineaActual, columnaActual))
                sb.clear();
                estado = 'q0';
                columnaActual++;
                nuevoToken = true;
            ///////////////////////////////////    
            }else if(estado == 'q10'){
                tokens.push(new Token(sb.toString(), this.TokenTypes.OPERADOR_RELACIONAL, lineaActual, columnaActual))
                sb.clear();
                estado = 'q0';
                columnaActual++;
                nuevoToken = true;
            }
        }

        this.imprimirTokens(tokens);
        this.imprimirErrores(errores);

        return [tokens, errores];

    }

    imprimirTokens(tokens){
        tokens.forEach(token => {
            console.log(`Token: ${token.valor}, ${token.tipo}, ${token.linea}, ${token.columna}`);
        });
    }

    imprimirErrores(errores){
        errores.forEach(error => {
            console.log(`Token: ${error.valor}, ${error.tipo}, ${error.linea}, ${error.columna}`);
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

    esPuntuacion(c){
        return (c === '.' || c === ',' || c === ';' || c === ':')
    }

    esAritmetico(c){
        return (c === '+' || c === '-' || c === '*' || c === '/' || c === '^')
    }

    esLogico(c){
        return (c === '|' || c === '&')
    }

    esAgrupacion(c){
        return (c === '(' || c === ')' || c === '{' || c === '}' || c === '[' || c === ']')
    }

    esRelacional(c){
        return (c === '<' || c === '>')
    }

    esEspacio(c) {
        const codigo = c.charCodeAt(0);
        if (codigo === 32 || // Espacio (' ')
            codigo === 9 ||  // Tabulador ('\t')
            codigo === 10 || // Salto de línea ('\n')
            codigo === 13) { // Retorno de carro ('\r')
          return true;
        } 
        return false;
      }
}