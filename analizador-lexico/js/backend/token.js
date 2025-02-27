export class Token {
    constructor(valor, tipo, linea, columna) {
      this.valor = valor;
      this.tipo = tipo;
      this.linea = linea;
      this.columna = columna;
    }
}