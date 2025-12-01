import { fract, pingPong } from "../utils/interpolation";
import Lerp from "../utils/interpolation";

export const getRandomSide = level => Math.floor(Math.random() * level.getSides()); 
export const getRandomDir = () => Math.random() < .5 ? -1 : 1;
export const getShift = () => Math.floor(Math.random() * 2);

export const mathRandom = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
export { fract, pingPong };

export const interpolate = Lerp.interpolate

export const linear = Lerp.Easing.LINEAR
export const easeIn = Lerp.Easing.EASE_IN
export const easeOut = Lerp.Easing.EASE_OUT
export const easeInOut = Lerp.Easing.EASE_IN_OUT
export const backIn = Lerp.Easing.BACK_IN
export const backOut = Lerp.Easing.BACK_OUT
export const backInOut = Lerp.Easing.BACK_IN_OUT
export const bounceIn = Lerp.Easing.BOUNCE_IN
export const bounceOut = Lerp.Easing.BOUNCE_OUT
export const bounceInOut = Lerp.Easing.BOUNCE_IN_OUT
export const exponentialIn = Lerp.Easing.EXPONENTIAL_IN
export const exponentialOut = Lerp.Easing.EXPONENTIAL_OUT
export const sineIn = Lerp.Easing.SINE_IN
export const sineOut = Lerp.Easing.SINE_OUT