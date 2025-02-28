export class StringBuilder {
    constructor() {
        this.cadenas = [];
    }

    append(texto) {
        this.cadenas.push(texto);
        return this;
    }

    toString() {
        return this.cadenas.join('');
    }

    clear() {
        this.cadenas = [];
    }
}