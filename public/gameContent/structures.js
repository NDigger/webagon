export class Vector2 {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Color {
    r = 0;
    g = 0;
    b = 0;
    a = 1;

    constructor(r, g, b, a) {
        if (r != null) this.r = r;
        if (g != null) this.g = g;
        if (b != null) this.b = b;
        if (a != null) this.a = a;
    }
}