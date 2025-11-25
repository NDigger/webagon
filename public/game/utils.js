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