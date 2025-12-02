import { Vector2 } from "../utils/structures"

export const getScreenCenter = () => new Vector2(1920/2, 1080/2)

export const rotatePoint = (point, center, angleDeg) => {
  const angle = angleDeg * Math.PI / 180;

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  const xRot = dx * Math.cos(angle) - dy * Math.sin(angle);
  const yRot = dx * Math.sin(angle) + dy * Math.cos(angle);

  return new Vector2(xRot + center.x, yRot + center.y);
}

export const secure = obj => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (String(prop).startsWith("_")) return undefined;
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "function") {
        return new Proxy(value, {
          apply(t, thisArg, args) {
            if (t.name.startsWith("_")) {
              throw new Error("Access denied");
            }
            return Reflect.apply(t, thisArg, args);
          }
        });
      }
      return value;
    },

    has(_, prop) {
      return !String(prop).startsWith("_");
    }
  });
}
