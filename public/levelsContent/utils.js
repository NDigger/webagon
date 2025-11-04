export const mathRandom = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
export const fract = t => t - Math.floor(t);
export const pingPong = t => (Math.floor(t * 2) % 2 === 0) ? fract(t * 2) : 1.-fract(t*2)