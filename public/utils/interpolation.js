import { Color } from './structures';

const linear = (t) => t;
const ease_in = (t, _pow = 3) => Math.pow(t, _pow);
const ease_out = (t, _pow = 3) => 1 - Math.pow(1 - t, _pow);
const ease_in_out = (t, _pow = 3) => {
	if (t < 0.5) return 0.5 * Math.pow(t * 2.0, _pow);
	else return 1.0 - 0.5 * Math.pow(2.0 * (1.0 - t), _pow);
}
const back_in = (t, _pow = 1) => {
	var s = _pow * 1.70158;
	return t * t * ((s + 1) * t - s);
}
const back_out = (t, _pow = 1) => {
	var s = _pow * 1.70158;
	var t1 = t - 1;
	return (t1 * t1 * ((s + 1) * t1 + s) + 1);
}
const back_in_out = (t, _pow = 1) => {
	var s = _pow * 1.70158;
	if (t < 0.5) {
		var t1 = 2 * t;
		return 0.5 * (t1 * t1 * ((s + 1) * t1 - s));
    } else {
		var t1 = 2 * t - 2;
		return 0.5 * (t1 * t1 * ((s + 1) * t1 + s) + 2);
    }
}
const bounce_in = (t, _pow = 3) => 1.0 - bounce_out(1.0 - t, _pow);
const bounce_out = (t, _pow = 3) => {
	if (t < 0.75) return 1 - Math.pow(1 - t, _pow);
	else return 1 - Math.pow(1 - t, _pow) + (sin((t - 0.75) * PI * 4) * 0.1 * (1 - t));
}
const bounce_in_out = (t, _pow = 3) => {
	if (t < 0.5) return 0.5 * bounce_in(t * 2.0, _pow);
	else return 0.5 * bounce_out(t * 2.0 - 1.0, _pow) + 0.5;
}
const exponential_in = (t, _pow = 1) => t > 0 ? Math.pow(2, (_pow * (t - 1))) : 0;
const exponential_out = (t, _pow = 1) => t < 1 ? 1.0 - Math.pow(2, -_pow * t) : 1.0;
const sine_in = (t, _pow = 1) => 1.0 - Math.cos(t * PI * 0.5);
const sine_out = (t, _pow = 1) => Math.sin(t * PI * 0.5);

export const Easing = Object.freeze({
    LINEAR: linear,
    EASE_IN: ease_in,
    EASE_OUT: ease_out,
    EASE_IN_OUT: ease_in_out,
    BACK_IN: back_in,
    BACK_OUT: back_out,
    BACK_IN_OUT: back_in_out,
    BOUNCE_IN: bounce_in,
    BOUNCE_OUT: bounce_out,
    BOUNCE_IN_OUT: bounce_in_out,
    EXPONENTIAL_IN: exponential_in,
    EXPONENTIAL_OUT: exponential_out,
    SINE_IN: sine_in,
    SINE_OUT: sine_out
})

const fract = t => t - Math.floor(t);
const pingPong = t => (Math.floor(t) % 2 === 0) ? fract(t) : 1.-fract(t)

export const CapMode = Object.freeze({
    fract: fract,
    pingPong: pingPong,
})

const isFromToInstanceOf = (from, to, variant) => 
    (variant === Number ? typeof from === 'number' && typeof to === 'number' 
    : from instanceof variant && to instanceof variant);

/* Supports Number and Color */
export default class Lerp {
    #runId = 0;
    value = 0;
    setter = () => {};
    #from = 0;

    static Easing = Easing;
    static CapMode = CapMode;

    constructor(setter) {
        if (typeof setter === 'function') this.setter = setter;
    }

    run(to, timeSeconds, easing = null, easingPow = null) {
        this.#runId++;
        const currentRunId = this.#runId;
        const start = performance.now();
        const from = this.value;

        const step = now => {
            if (currentRunId !== this.#runId) return false;

            let t = (now - start) / (timeSeconds * 1000);
            t = Math.min(t, 1);

            if (typeof easing === 'function') {
                t = easingPow ? easing(t, easingPow) : easing(t);
            }

            this.value = Lerp.interpolate(from, to, t);
            if (this.setter) this.setter(this.value);

            if (t < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
        return this
    }

    apply(value) {
        this.stop();
        this.value = value;
        this.setter(value);
        return this;
    }

    stop() { this.#runId++ };

    static interpolate(a, b, t) {
        const clamped = Math.min(Math.max(t, 0), 1) 
        if (isFromToInstanceOf(a, b, Color)) {
            return new Color(
                a.r + (b.r - a.r) * clamped,
                a.g + (b.g - a.g) * clamped,
                a.b + (b.b - a.b) * clamped,
                a.a + (b.a - a.a) * clamped
            )
        } else if (isFromToInstanceOf(a, b, Number)) {
            return a + (b - a) * clamped;
        } else {
            throw new Error('Invalid type.')
        }
    }
}