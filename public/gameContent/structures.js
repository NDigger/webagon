export class Vector2 {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec2) { return new Vector2(this.x + vec2.x, this.y + vec2.y) }
    sub(vec2) { return new Vector2(this.x - vec2.x, this.y - vec2.y) }
    mul(vec2) { return new Vector2(this.x * vec2.x, this.y * vec2.y) }
    div(vec2) { return new Vector2(this.x / vec2.x, this.y / vec2.y) }

    rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
        this.x * cos - this.y * sin,
        this.x * sin + this.y * cos
    )
}
}

export class Color {
    r = 0;
    g = 0;
    b = 0;
    a = 255;

    constructor(r, g, b, a) {
        if (r != null) this.r = r;
        if (g != null) this.g = g;
        if (b != null) this.b = b;
        if (a != null) this.a = a;
    }
    
    getRGBStyle() { return `rgb(${this.r}, ${this.g}, ${this.b})` };
    getRGBAStyle() { return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` };
    
    static hsvToRgb(h, s, v) {
        let r, g, b;

        const hue = Math.abs(h)
        const sat = Math.max(Math.min(s, 1), 0);
        const val = Math.max(Math.min(v, 1), 0);

        let i = Math.floor(hue * 6);
        let f = hue * 6 - i;
        let p = val * (1 - sat);
        let q = val * (1 - f * sat);
        let t = val * (1 - (1 - f) * sat);

        switch (i % 6) {
            case 0: r = val; g = t; b = p; break;
            case 1: r = q; g = val; b = p; break;
            case 2: r = p; g = val; b = t; break;
            case 3: r = p; g = q; b = val; break;
            case 4: r = t; g = p; b = val; break;
            case 5: r = val; g = p; b = q; break;
        }

        return new Color(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        )
    }
    
    static hsvaToRgba(h, s, v, a) {
        const c = Color.hsvToRgb(h, s, v);
        return new Color(c.r, c.g, c.b, a);
    }
}