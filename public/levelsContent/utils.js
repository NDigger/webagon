import Lerp from "../utils/interpolation";

export const interpolate = Lerp.interpolate

export const mathRandom = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
export const fract = t => t - Math.floor(t);
export const pingPong = t => (Math.floor(t * 2) % 2 === 0) ? fract(t * 2) : 1.-fract(t*2)

export const linear = (t) => t;
export const ease_in = (t, _pow = 3) => Math.pow(t, _pow);
export const ease_out = (t, _pow = 3) => 1 - Math.pow(1 - t, _pow);
export const ease_in_out = (t, _pow = 3) => {
	if (t < 0.5) return 0.5 * Math.pow(t * 2.0, _pow);
	else return 1.0 - 0.5 * Math.pow(2.0 * (1.0 - t), _pow);
}
export const back_in = (t, _pow = 1) => {
	var s = _pow * 1.70158;
	return t * t * ((s + 1) * t - s);
}
export const back_out = (t, _pow = 1) => {
	var s = _pow * 1.70158;
	var t1 = t - 1;
	return (t1 * t1 * ((s + 1) * t1 + s) + 1);
}
export const back_in_out = (t, _pow = 1) => {
	var s = _pow * 1.70158;
	if (t < 0.5) {
		var t1 = 2 * t;
		return 0.5 * (t1 * t1 * ((s + 1) * t1 - s));
    } else {
		var t1 = 2 * t - 2;
		return 0.5 * (t1 * t1 * ((s + 1) * t1 + s) + 2);
    }
}
export const bounce_in = (t, _pow = 3) => 1.0 - bounce_out(1.0 - t, _pow);
export const bounce_out = (t, _pow = 3) => {
	if (t < 0.75) return 1 - Math.pow(1 - t, _pow);
	else return 1 - Math.pow(1 - t, _pow) + (Math.sin((t - 0.75) * Math.PI * 4) * 0.1 * (1 - t));
}
export const bounce_in_out = (t, _pow = 3) => {
	if (t < 0.5) return 0.5 * bounce_in(t * 2.0, _pow);
	else return 0.5 * bounce_out(t * 2.0 - 1.0, _pow) + 0.5;
}
export const exponential_in = (t, _pow = 1) => t > 0 ? Math.pow(2, (_pow * (t - 1))) : 0;
export const exponential_out = (t, _pow = 1) => t < 1 ? 1.0 - Math.pow(2, -_pow * t) : 1.0;
export const sine_in = (t, _pow = 1) => 1.0 - Math.cos(t * Math.PI * 0.5);
export const sine_out = (t, _pow = 1) => Math.sin(t * Math.PI * 0.5);