export default class GameLerp {
  static instances = [];

  constructor(setter, destroyAfterRun = false) {
    this.start = 0;
    this.end_ = 0;
    this.elapsed = 0;
    this.time = 9999;
    this.value = 0;
    this.setter = setter || null;
    this.easing = null;
    this.updateEnabled = false;
    this.destroyAfterRun = destroyAfterRun;

    GameLerp.instances.push(this);
  }

  destroy() {
    const index = GameLerp.instances.indexOf(this);
    if (index !== -1) {
      GameLerp.instances.splice(index, 1);
    }
    this.updateEnabled = false;
    this.setter = null;
  }

  run(start, end_, time, easing) {
    this.start = start;
    this.end_ = end_;
    this.time = time;
    this.easing = easing || null;
    this.elapsed = 0;
    if (!this.updateEnabled) this.updateEnabled = true;
    return this;
  }

  apply(value) {
    this.start = value;
    this.end_ = value;
    this.elapsed = 0;
    if (this.setter) this.setter(value);
    this.value = value;
    this.updateEnabled = false;
  }

  update(mFrameTime) {
    if (!this.updateEnabled || this.elapsed > this.time) return;

    this.elapsed += mFrameTime;
    let t = Math.min(this.elapsed / this.time, 1);
    let easedT = this.easing ? this.easing(t) : t;

    let newValue;
    
    if (this.isColor(this.start) && this.isColor(this.end_)) {
      newValue = {
        r: this.start.r + (this.end_.r - this.start.r) * easedT,
        g: this.start.g + (this.end_.g - this.start.g) * easedT,
        b: this.start.b + (this.end_.b - this.start.b) * easedT,
        a: this.start.a + (this.end_.a - this.start.a) * easedT,
      };
    } else if (this.isVector2(this.start) && this.isVector2(this.end_)) {
      newValue = {
        x: this.start.x + (this.end_.x - this.start.x) * easedT,
        y: this.start.y + (this.end_.y - this.start.y) * easedT,
      };
    } else if (this.isSize(this.start) && this.isSize(this.end_)) {
      newValue = {
        width: this.start.width + (this.end_.width - this.start.x) * easedT,
        height: this.start.height + (this.end_.height - this.start.y) * easedT,
      };
    } else {
        newValue = this.start + (this.end_ - this.start) * easedT;
    }

    if (this.setter) this.setter(newValue);
    this.value = newValue;

    if (this.elapsed >= this.time) {
      if (this.destroyAfterRun) {
        this.destroy();
      } else {
        this.updateEnabled = false;
      }
    }
  }

  // Метод для обновления всех экземпляров
  static updateAll(mFrameTime) {
    for (const instance of GameLerp.instances) {
      instance.update(mFrameTime);
    }
  }

  // Вспомогательные методы для проверки типа
  isColor(val) {
    return val && typeof val === 'object' &&
           'r' in val && 'g' in val && 'b' in val && 'a' in val;
  }

  isVector2(val) {
    return val && typeof val === 'object' &&
           'x' in val && 'y' in val;
  }
  isSize(val) {
    return val && typeof val === 'object' &&
           'width' in val && 'height' in val;
  }
}