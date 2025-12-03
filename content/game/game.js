import Wall from "./gameContent/wall";
import Polygon from "./gameContent/polygon";
import { Vector2, Color, Size } from "../utils/structures";
import Background from "./gameContent/background";
import GameObject from "./gameContent/gameObject";
import Death from "./gameContent/death";
import { getFPS } from "../frameCounter";
import Lerp, { pingPong } from "../utils/interpolation";
import ParticleEmitter from "./gameContent/particleEmitter";
import { getConfig } from "../storage";
import { sounds } from "../script";

const area = (a, b, c) => {
  return Math.abs(
    (a.x * (b.y - c.y) +
     b.x * (c.y - a.y) +
     c.x * (a.y - b.y)) / 2
  );
}

const pointInTriangle = (p, a, b, c) => {
  const A = area(a, b, c);
  const A1 = area(p, b, c);
  const A2 = area(a, p, c);
  const A3 = area(a, b, p);
  return Math.abs(A - (A1 + A2 + A3)) < 1e-9;
}

const pointInQuad = (p, pos4) => pointInTriangle(p, pos4[0], pos4[1], pos4[2]) || pointInTriangle(p, pos4[0], pos4[2], pos4[3]);


function distPointToLine(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let t = dot / len_sq;
  t = Math.max(0, Math.min(1, t));
  const x = x1 + t * C;
  const y = y1 + t * D;
  return Math.hypot(px - x, py - y);
}

function closestSide(pos, points) {
  let minDist = Infinity;
  let sideIndex = -1;
  for (let i = 0; i < 4; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % 4];
    const d = distPointToLine(pos.x, pos.y, p1.x, p1.y, p2.x, p2.y);
    if (d < minDist) {
      minDist = d;
      sideIndex = i;
    }
  }
  return sideIndex;
}

const gameArrowLeft = document.getElementById('game-arrow-left');
const gameArrowRight = document.getElementById('game-arrow-right');

function closestOutsidePoint(quad, p) {
  const offset = 0.1;
  function dot(a,b){return a.x*b.x+a.y*b.y;}
  function sub(a,b){return {x:a.x-b.x,y:a.y-b.y};}
  function add(a,b){return {x:a.x+b.x,y:a.y+b.y};}
  function mul(a,s){return {x:a.x*s,y:a.y*s};}

  function isInside(q,p){
    let sign = null;
    for (let i=0;i<4;i++){
      let a=q[i], b=q[(i+1)%4];
      let ap=sub(p,a), ab=sub(b,a);
      let cross = ab.x*ap.y - ab.y*ap.x;
      if(sign===null) sign = cross>0;
      else if((cross>0)!==sign) return false;
    }
    return true;
  }

  function closestPointOnSegment(a,b,p){
    let ab=sub(b,a);
    let t=dot(sub(p,a),ab)/dot(ab,ab);
    t=Math.max(0,Math.min(1,t));
    return add(a, mul(ab,t));
  }

  if(!isInside(quad,p)) return p;

  let best=null, bestDist=Infinity, bestNormal=null;

  for(let i=0;i<4;i++){
    let a=quad[i], b=quad[(i+1)%4];
    let cp=closestPointOnSegment(a,b,p);

    let d=(cp.x-p.x)**2 + (cp.y-p.y)**2;
    if(d<bestDist){
      bestDist=d;
      best=cp;

      let ab=sub(b,a);
      let n={x:-ab.y, y:ab.x};
      let ln=Math.hypot(n.x,n.y);
      n.x/=ln; n.y/=ln;

      let toP=sub(p,cp);
      if(dot(n,toP)>0) { n.x=-n.x; n.y=-n.y; }

      bestNormal=n;
    }
  }
  return add(best, mul(bestNormal, offset));
}


function triArea2D(p1, p2, p3) {
  return Math.abs(
    (p1.x * (p2.y - p3.y) +
     p2.x * (p3.y - p1.y) +
     p3.x * (p1.y - p2.y)) * 0.5
  );
}

function quadArea2D(q) {
  const [a, b, c, d] = q;
  return triArea2D(a, b, c) + triArea2D(a, c, d);
}

// чат жипити спасибо что делаешь рабочий рейкастинг за меня дай бог тебе здоровья
function closestOutsidePointOnRadius(quad, p, radius) {
    const offset = 0.01;
    function dot(a,b){return a.x*b.x+a.y*b.y;}
    function sub(a,b){return {x:a.x-b.x,y:a.y-b.y};}
    function add(a,b){return {x:a.x+b.x,y:a.y+b.y};}
    function mul(a,s){return {x:a.x*s,y:a.y*s};}

    function isInside(q,p){
        let sign = null;
        for (let i=0;i<4;i++){
        let a=q[i], b=q[(i+1)%4];
        let ap=sub(p,a), ab=sub(b,a);
        let cross = ab.x*ap.y - ab.y*ap.x;
        if(sign===null) sign = cross>0;
        else if((cross>0)!==sign) return false;
        }
        return true;
    }

    function closestPointOnSegment(a,b,p){
        let ab=sub(b,a);
        let t=dot(sub(p,a),ab)/dot(ab,ab);
        t=Math.max(0,Math.min(1,t));
        return add(a, mul(ab,t));
    }

    // Если уже снаружи — просто отдаём точку на окружности
    if (!isInside(quad, p)) {
        const len = Math.hypot(p.x, p.y);
        return { x: (p.x/len) * radius, y: (p.y/len) * radius };
    }

    // Ищем ближайшую точку на грани
    let best = null;
    let bestDist = Infinity;
    let bestNormal = null;

    for (let i = 0; i < 4; i++) {
        let a = quad[i];
        let b = quad[(i+1)%4];
        let cp = closestPointOnSegment(a, b, p);

        let d = (cp.x - p.x)**2 + (cp.y - p.y)**2;
        if (d < bestDist) {
        bestDist = d;
        best = cp;

        // Нормаль наружу (левая)
        let ab = sub(b, a);
        let n = { x: -ab.y, y: ab.x };
        let ln = Math.hypot(n.x, n.y);
        n.x /= ln; 
        n.y /= ln;

        // Проверяем правильность направления
        let toP = sub(p, cp);
        if (dot(n, toP) > 0) { 
            n.x = -n.x;
            n.y = -n.y;
        }

        bestNormal = n;
        }
    }

    // Смещаем точку наружу на offset
    const pushed = add(best, mul(bestNormal, offset));

    // И теперь возвращаем только координату на окружности
    const angle = Math.atan2(pushed.y, pushed.x);

    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
    };
    }


export default class Game extends GameObject {
    #background;
    #backgroundRotationOffset = 0;

    #config = getConfig();

    #died = false;
    #layer = 0;

    #playerSwapParticleEmitters = [];

    #polygonColor = null;
    #polygon;
    #deathEffect;

    #walls = [];

    #rotationSpeed = 0;
    #rotation = 0;
    #sides = 6;
    #skew = 0;
    #scale = new Vector2(1, 1);
    #wallScale = new Vector2(1, 1);
    #offset = new Vector2(0, 0);
    #centerOffset = new Vector2(0, 0);
    #backgroundTileColors = [];

    #layersCount3d = 0;
    #distance3d = 0;
    #color3d = null;
    #falloffColor3d = null;
    #falloffScale3d = new Vector2(1, 1);
    #depthMult3d = 0;

    #mainColor = new Color(0, 0, 0);
    #wallSpawnDistance = 1500;
    #wallSpeedMult = 2;
    #wallSkewLeft = 0;
    #wallSkewRight = 0;
    #wallAngleLeft = 0;
    #wallAngleRight = 0;

    #leftKeyPressed = false;
    #rightKeyPressed = false;
    #swapKeyPressed = false;
    #swapEnabled = false;
    #swapRequested = false;
    #swapReloadTime = 0;
    #currentSwapReloadTime = 0;
    #playerMovementEnabled = true;

    #updateId;
    #lastUpdateTime = performance.now();

    #distanceSignal;
    #distanceDelay = -1;

    onDeath = () => {};
    onSwap = () => {};

    constructor(app) {
        super(app)
        this.#background = new Background(app);
        this.#background.setLayer(this.#getBackgroundLayer());
        this.#polygon = new Polygon(app);
        this.#polygon.setLayer(this.#getPolygonLayer());
        this.#polygon.set3dLayer(this.#get3dLayer());

        this.#swapReloadTime = 0.3;

        this.addEventListeners();

        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }
    
    addEventListeners() {
        gameArrowLeft.addEventListener('touchstart', this.#onGameArrowLeftPressed, {passive: true})
        gameArrowLeft.addEventListener('touchend', this.#onGameArrowLeftReleased, {passive: true})
        gameArrowRight.addEventListener('touchstart', this.#onGameArrowRightPressed, {passive: true})
        gameArrowRight.addEventListener('touchend', this.#onGameArrowRightReleased, {passive: true})

        document.addEventListener('mousedown', this.#onMouseDown)
        document.addEventListener('mouseup', this.#onMouseUp)

        document.addEventListener('contextmenu', this.#contextMenuEvent);

        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
    }

    removeEventListeners() {
        gameArrowLeft.removeEventListener('touchstart', this.#onGameArrowLeftPressed)
        gameArrowLeft.removeEventListener('touchend', this.#onGameArrowLeftReleased)
        gameArrowRight.removeEventListener('touchstart', this.#onGameArrowRightPressed)
        gameArrowRight.removeEventListener('touchend', this.#onGameArrowRightReleased)

        document.removeEventListener('mousedown', this.#onMouseDown)
        document.removeEventListener('mouseup', this.#onMouseUp)

        document.removeEventListener('contextmenu', this.#contextMenuEvent);

        window.removeEventListener('keydown', this.#onKeyDown);
        window.removeEventListener('keyup', this.#onKeyUp);
    }

    #onGameArrowLeftPressed = () => this.#leftKeyPressed = true;
    #onGameArrowLeftReleased = () => this.#leftKeyPressed = false;
    #onGameArrowRightPressed = () => this.#rightKeyPressed = true;
    #onGameArrowRightReleased = () => this.#rightKeyPressed = false;
    
    #onKeyDown = e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.#leftKeyPressed = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.#rightKeyPressed = true;

        if (e.code === 'Space' && this.#swapEnabled && !this.#swapKeyPressed && this.#currentSwapReloadTime < 0) {
            this.#swapRequested = true;
            this.#swapKeyPressed = true;
        }
    }
    #onKeyUp = e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.#leftKeyPressed = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.#rightKeyPressed = false;
        if (e.code === 'Space') this.#swapKeyPressed = false;
    }

    #onMouseDown = e => {
        if (e.button === 0) this.#leftKeyPressed = true;
        if (e.button === 2) {
            e.preventDefault();
            this.#rightKeyPressed = true;
        }
    }
    #onMouseUp = e => {
        if (e.button === 0) this.#leftKeyPressed = false;
        if (e.button === 2) {
            e.preventDefault();
            this.#rightKeyPressed = false;
        }
    }

    #contextMenuEvent = e => e.preventDefault();

    #getPolygonLayer() { return this.#layer + 0.004}
    #getWallsLayer() { return this.#layer + 0.003}
    #get3dLayer() { return this.#layer + 0.002}
    #getBackgroundLayer() { return this.#layer + 0.001}

    #getDefault3dColor() { 
        const brightness = .7
        return new Color(this.#mainColor.r * brightness, this.#mainColor.g * brightness, this.#mainColor.b * brightness, this.#mainColor.a) 
    }
    #getPolygonColor() {
        return this.#polygonColor ?? this.#backgroundTileColors[this.#background.getSwapped() || this.#backgroundTileColors.length === 1 ? 0 : 1]
    }
    #getSwapColor() {
        return this.#config.swapHighlightEnabled ? Lerp.interpolate(new Color(255, 0, 0), new Color(255, 255, 0), pingPong(this.#lastUpdateTime*0.01)) : this.#mainColor;
    }
    #getPlayerColor() {
        return this.#currentSwapReloadTime < 0 && this.#swapEnabled ? this.#getSwapColor() : this.#mainColor;
    }
    #get3dColor() { return this.#color3d ?? this.#getDefault3dColor() }

    kill() {
        if (this.isDestroyed() || this.#config.invincibleModeEnabled) return

        const d = new Death(this.app);
        d.setSkew(this.#skew);
        d.setOffset(this.#polygon.player.getOffset().add(this.#polygon.player.getPointPosition()));
        d.setRotation(this.#rotation)
        d.setCenterOffset(this.#centerOffset);
        d.set3dLayer(this.#get3dLayer());
        d.setScale(this.#scale);

        d.set3dColor(this.#get3dColor());
        d.set3dLayersCount(this.#layersCount3d);
        d.set3dDistance(this.#distance3d);
        d.set3dDepthMult(this.#depthMult3d);
        d.setSides(this.#sides)
        if (this.#falloffColor3d != null) d.set3dFalloffColor(this.#falloffColor3d)

        this.#swapEnabled = false;
        this.#playerMovementEnabled = false;
        this.#background.setSwapEnabled(false);

        this.#deathEffect = d;
        this.#died = true;
        
        this.draw();
        this.onDeath()
    }

    draw() {
        this.#background.draw();
        this.#polygon.draw();
        if (this.#deathEffect) this.#deathEffect.draw();
        this.#walls.forEach(w => w.draw());
    }

    #updateWalls(walls, frameTime) {
        const minDistance = 30;
        const minThickness = 0;
        return walls.filter(wall => {
            const decrease = value => value - frameTime * this.#wallSpeedMult / 5
            if (wall.getDistance() > minDistance) wall.setDistance(Math.max(minDistance, decrease(wall.getDistance())));
            else if (wall.getThickness() > minThickness) wall.setThickness(Math.max(minThickness, decrease(wall.getThickness())));

            if (wall.getThickness() <= minThickness && wall.getDistance() <= minDistance) {
                wall.destroy()
                return false;
            }

            wall.updatePosition()

            return true
        })
    }

    #updatePlayerSwapParticleEmitters() {
        this.#playerSwapParticleEmitters.forEach(pe => {
            const particles = pe.getParticles();
            particles.forEach(p => {
                p.setColor(this.#getSwapColor());
                p.setSkew(this.#skew);
                p.setRotation(this.#rotation);
                p.set3dColor(this.#get3dColor())
                p.set3dDepthMult(this.#depthMult3d);
                p.set3dDistance(this.#distance3d);
                p.set3dFalloffColor(this.#getDefault3dColor());
                p.set3dFalloffScale(this.#falloffScale3d);
                p.set3dLayer(this.#get3dLayer);
                // p.set3dLayersCount(this.#layersCount3d);
                p.setScale(this.#scale);
                p.setCenterOffset(this.#centerOffset);
            })
        })
    }

    #createPlayerSwapParticle() {
        const particleEmitter = new ParticleEmitter(this.app);
        particleEmitter.angle = this.#polygon.player.getRotationOffset()/180*Math.PI-Math.PI/4;
        particleEmitter.angleVariation = 2;
        particleEmitter.lifetime = .3;
        particleEmitter.lifetimeVariation = .1;
        particleEmitter.sizeStart = 10;
        particleEmitter.sizeEnd = 0;
        particleEmitter.speed = 120;
        particleEmitter.speedVariation = 200;
        particleEmitter.onFinished = () => {
            particleEmitter.destroy();
            this.#playerSwapParticleEmitters.splice(this.#playerSwapParticleEmitters.findIndex(pe => pe === particleEmitter), 1)
        }
        particleEmitter.emit(10);
        const particles = particleEmitter.getParticles()
        particles.forEach(p => {
            p.setOffset(this.#polygon.player.getPointPosition().add(this.#polygon.player.getOffset()))
            p.setLayer(this.#getPolygonLayer());
        })
        this.#playerSwapParticleEmitters.push(particleEmitter);
    }

    #swapPlayer() {
        if (this.#config.swapParticlesEnabled) this.#createPlayerSwapParticle();
        sounds.swap.play();
        this.#currentSwapReloadTime = this.#swapReloadTime;
        this.#polygon.player.setRotationOffset(this.#polygon.player.getRotationOffset() + 180);
        this.#polygon.player.updatePosition();
        this.onSwap();
        if (this.#getCollidingWalls().length !== 0) this.kill();
    }

    #getCollidingWalls() { // Returns a first wall if player collides with it
        return this.#walls.filter(wall => pointInQuad(this.#polygon.player.getPointAbsolutePosition(), wall.getVertexAbsolutePos4()))
    }

    #updatePlayer(frameTime) {
        this.#polygon.player.setColor(this.#getPlayerColor())
        this.#currentSwapReloadTime -= frameTime/1000;

        let prevRotationOffset = this.#polygon.player.getRotationOffset();
        const playerSpeed = frameTime * .6;
        const tiltSpeed = 0.0014 * frameTime * this.#config.playerTiltMult * 5;
        const maxTilt = this.#config.playerTiltMult;
        
        if (this.#playerMovementEnabled) {
            if (!this.#config.swapOnHold ? this.#swapRequested : (this.#currentSwapReloadTime <= 0 && this.#swapKeyPressed)) {
                this.#swapPlayer();
                prevRotationOffset += 180;
                this.#swapRequested = false;
            }
            if (this.#leftKeyPressed) {
                this.#polygon.player.setRotationOffset(this.#polygon.player.getRotationOffset() - playerSpeed);
                if (this.#polygon.player.getTilt() > -maxTilt)
                    this.#polygon.player.setTilt(this.#polygon.player.getTilt() - tiltSpeed)
            }
            if (this.#rightKeyPressed) {
                this.#polygon.player.setRotationOffset(this.#polygon.player.getRotationOffset() + playerSpeed);
                if (this.#polygon.player.getTilt() < maxTilt)
                    this.#polygon.player.setTilt(this.#polygon.player.getTilt() + tiltSpeed)
            }
            if (!this.#leftKeyPressed && !this.#rightKeyPressed) {
                if (this.#polygon.player.getTilt() > 0) 
                    this.#polygon.player.setTilt(Math.max(0, this.#polygon.player.getTilt() - tiltSpeed))
                else if (this.#polygon.player.getTilt() < 0) 
                    this.#polygon.player.setTilt(Math.min(0, this.#polygon.player.getTilt() + tiltSpeed))
            }
            this.#polygon.player.updatePosition()
        }
        const collidingWalls = this.#getCollidingWalls();
        if (collidingWalls.length !== 0) {
            const wall = collidingWalls.sort((w1, w2) => quadArea2D(w2.getVertexPos4()) - quadArea2D(w1.getVertexPos4()))[0];
            const vertexPos4 = wall.getVertexPos4().map(pos => pos.mul(wall.getScale().div(this.#scale)));
            const point = this.#polygon.player.getPointPosition();
            const safePoint = closestOutsidePointOnRadius(vertexPos4, point, Math.hypot(point.y, point.x));
            const safeAngle = Math.atan2(safePoint.y, safePoint.x);
            const degrees = safeAngle * 180 / Math.PI;
            this.#polygon.player.setRotationOffset(degrees);
            this.#polygon.player.updatePosition()
        }
    }

    #update(time) {
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;

        if (!this.#died) this.#rotation += this.#rotationSpeed * frameTime;
        this.#polygon.setRotation(this.#rotation)
        this.#background.setRotation(this.#rotation + this.#backgroundRotationOffset);

        this.#polygon.player.updatePosition();
        this.#walls.forEach(wall => {
            wall.setRotation(this.#rotation);
            wall.updatePosition();
        });

        const fps = getFPS();
        const fpsSteps = Math.floor(1200/(fps !== 0 ? fps : 30));
        const steps = Math.max(fpsSteps, 30);

        for (let i = 0; i < steps; i++) {
            if (this.#died) break
            const stepFrameTime = frameTime / steps
            this.#distanceDelay -= stepFrameTime * this.#wallSpeedMult / 5;
            if (this.#distanceDelay <= 0 && typeof this.#distanceSignal === 'function') {
                this.#distanceSignal();
                this.#distanceSignal = null;
            }
            this.#walls = this.#updateWalls(this.#walls, stepFrameTime);
            if (!this.#died && this.#getCollidingWalls().length !== 0) this.kill();
        }
        for (let i = 0; i < steps; i++) {
            if (this.#died) break
            const stepFrameTime = frameTime / steps
            if (i % Math.floor(steps/20) === 0) this.#polygon.player.draw();
            this.#updatePlayer(stepFrameTime)
        }

        if (this.#died) {
            if (this.#deathEffect) this.#deathEffect.setColor(Color.hsvToRgb(time/500, 1., 1.));
            this.#polygon.player.setColor(Color.hsvToRgb(time/500 + .5, 1., 1.));
        }

        this.#updatePlayerSwapParticleEmitters();

        this.draw();
        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    createWall(side, thickness) {
        if (this.#died || this.isDestroyed()) return; 
        const wall = new Wall(this.app);
        wall.setSides(this.#sides)
        wall.setSide(Math.floor(side))
        wall.setThickness(thickness);
        wall.setRotation(this.#rotation)
        wall.setColor(this.#mainColor);
        wall.setDistance(this.#wallSpawnDistance);
        wall.setLayer(this.#getWallsLayer());
        wall.setSkew(this.#skew);
        wall.setScale(this.#scale.mul(this.#wallScale))
        wall.setCenterOffset(this.#centerOffset);
        wall.setOffset(this.#offset)

        wall.setSkewLeft(this.#wallSkewLeft)
        wall.setSkewRight(this.#wallSkewRight)
        wall.setLeftAngleOffset(this.#wallAngleLeft)
        wall.setRightAngleOffset(this.#wallAngleRight)

        if (this.#falloffColor3d) wall.set3dFalloffColor(this.#falloffColor3d);
        wall.set3dLayersCount(this.#layersCount3d);
        wall.set3dDistance(this.#distance3d);
        wall.set3dLayer(this.#get3dLayer());
        wall.set3dColor(this.#get3dColor());
        wall.set3dDepthMult(this.#depthMult3d);
        wall.set3dFalloffScale(this.#falloffScale3d);

        wall.draw();

        this.#walls.push(wall);
    }
    setLayer(v) {
        this.#layer = v;
        this.#background.setLayer(this.#getBackgroundLayer());
        this.#background.set3dLayer(this.#get3dLayer());
        this.#polygon.setLayer(this.#getPolygonLayer());
        this.#polygon.set3dLayer(this.#get3dLayer());
        this.#walls.forEach(wall => {
            wall.setLayer(this.#getWallsLayer());
            wall.set3dLayer(this.#get3dLayer());
        })
    }
    getLayer() { return this.#layer }
    setRotation(v) { 
        if (typeof(v) !== 'number') return 
        this.#rotation = v; 
        this.#background.setRotation(v);
        this.#polygon.setRotation(v);
        this.#walls.forEach(wall => wall.setRotation(v));
        if (this.#deathEffect) this.#deathEffect.setRotation(v);
    }
    getRotation() { return this.#rotation }
    setRotationSpeed(v) { if (typeof(v) === 'number') this.#rotationSpeed = v; }
    getRotationSpeed() { return this.#rotationSpeed }
    setRadius(v) { if (typeof(v) === 'number') this.#polygon.setThickness(v); }
    getRadius() { return this.#polygon.getThickness() }
    setSkew(v) {
        if (typeof(v) !== 'number') return
        this.#skew = v
        this.#background.setSkew(v);
        this.#polygon.setSkew(v);
        if (this.#deathEffect !== undefined) this.#deathEffect.setSkew(v);
        this.#walls.forEach(wall => wall.setSkew(v));        
    }
    getSkew() { return this.#skew; }
    setSides(v) {
        if (typeof(v) !== 'number') return
        this.#background.setSides(v);
        this.#polygon.setSides(v);
        if (this.#deathEffect !== undefined) this.#deathEffect.setSides(v);
        this.#sides = v;
    }
    getSides() { return this.#sides; }
    setBackgroundTileColors(arr) {
        const v = arr.map(c => new Color(c.r, c.g, c.b, c.a));
        this.#backgroundTileColors = v;
        this.#background.setTileColors(v);
        this.#polygon.setColor(this.#getPolygonColor());
    }
    getBackgroundTileColors() { return this.#backgroundTileColors; }
    setBackgroundRotationOffset(v) {
        if (typeof(v) !== 'number') return 
        this.#backgroundRotationOffset = v;
        this.#background.setRotation(this.#backgroundRotationOffset + this.#rotation)
    }
    getBackgroundRotationOffset() { return this.#backgroundRotationOffset; }
    setBackgroundRadius(v) {
        if (typeof(v) !== 'number') return
        this.#background.setThickness(v);
    }
    getBackgroundRadius() { return this.#background.getThickness() }
    setMainColor({r, g, b, a}) {
        const color = new Color(r, g, b, a)
        this.#mainColor = color;
        this.#polygon.setBorderColor(color);
        this.#polygon.player.setColor(this.#getPlayerColor());

        this.#walls.forEach(w => {
            w.setColor(color)
            if (this.#color3d === null) w.set3dColor(this.#getDefault3dColor());
        });
        if (this.#color3d === null) this.#polygon.set3dColor(this.#getDefault3dColor());
        this.draw();
    }
    getMainColor() { return this.#mainColor }
    setPolygonColor({r, g, b, a}) {
        const color = new Color(r, g, b, a);
        this.#polygonColor = color;
        this.#polygon.setColor(this.#getPolygonColor());
    }
    getPolygonColor() { return this.#polygonColor }
    clearPolygonColor() {
        this.#polygonColor = null;
        this.#polygon.setColor(this.#getPolygonColor());
    }
    setWallSpawnDistance(v) {
        if (typeof(v) !== 'number') return;
        this.#wallSpawnDistance = v;
    }
    getWallSpawnDistance() { return this.#wallSpawnDistance }
    setWallSpeedMult(v) {
        if (typeof(v) !== 'number') return;
        this.#wallSpeedMult = v;
    }
    getWallSpeedMult() { return this.#wallSpeedMult }
    set3dLayersCount(v) {
        if (typeof(v) !== 'number') return;
        const layersCount = Math.floor(v);
        this.#layersCount3d = layersCount;
        this.#walls.forEach(wall => wall.set3dLayersCount(layersCount));
        this.#polygon.set3dLayersCount(layersCount)
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dLayersCount(v);
    }
    get3dLayersCount() { return this.#layersCount3d }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
        this.#walls.forEach(wall => wall.set3dDistance(v));
        this.#polygon.set3dDistance(v)
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dDistance(v);
    }
    get3dDistance() { return this.#distance3d }
    set3dColor({r, g, b, a}) {
        if (r != null && g != null && b != null) {
            const color = new Color(r, g, b, a);
            this.#color3d = color;
            this.#polygon.set3dColor(color)
            if (this.#deathEffect !== undefined) this.#deathEffect.set3dColor(color);
            this.#walls.forEach(wall => wall.set3dColor(color));
        } else {
            if (this.#deathEffect !== undefined) this.#deathEffect.set3dColor(this.#getDefault3dColor);
            this.#walls.forEach(wall => wall.set3dColor(this.#getDefault3dColor()));
        }
    }
    get3dColor() { return this.#color3d; }
    clear3dColor() {
        this.#color3d = null;
    }
    set3dFalloffColor({r, g, b, a}) {
        const color = new Color(r, g, b, a);
        this.#falloffColor3d = color;
        this.#polygon.set3dFalloffColor(color);
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dFalloffColor(color);
        this.#walls.forEach(wall => wall.set3dFalloffColor(color));
    }
    get3dFalloffColor() { return this.#falloffColor3d; }
    clear3dFalloffColor() {
        this.#falloffColor3d = null;
        this.#polygon.clear3dFalloffColor();
        this.#walls.forEach(w => w.clear3dFalloffColor());
        if (this.#deathEffect !== undefined) this.#deathEffect.clear3dFalloffColor();
    }
    set3dDepthMult(v) {
        if (typeof(v) !== 'number') return;
        this.#depthMult3d = v;
        this.#polygon.set3dDepthMult(v);
        this.#background.set3dDepthMult(v);
        this.#walls.forEach(wall => wall.set3dDepthMult(v));
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dDepthMult(v);
    }
    get3dDepthMult() { return this.#depthMult3d }
    set3dFalloffScale({x, y}) {
        const v = new Vector2(x, y);
        this.#falloffScale3d = v;
        this.#polygon.set3dFalloffScale(v);
        this.#walls.forEach(wall => wall.set3dFalloffScale(v));
    }
    get3dFalloffScale() { return this.#falloffScale3d }
    setSwapEnabled(v) {
        if (typeof(v) !== 'boolean') return;
        this.#swapEnabled = v;
    }
    getSwapEnabled() { return this.#swapEnabled }
    setPlayerSwapReloadTime(v) {
        if (typeof(v) !== 'number') return;
        this.#swapReloadTime = v;
    }
    getPlayerSwapReloadTime() { return this.#swapReloadTime }
    #updateWallScale() {
        this.#walls.forEach(wall => wall.setScale(this.#scale.mul(this.#wallScale)));
    }
    setScale({x, y}) {
        const scale = new Vector2(x, y);
        this.#scale = scale;
        this.#polygon.setScale(scale);
        this.#background.setScale(scale);
        if (this.#deathEffect !== undefined) this.#deathEffect.setScale(scale);
        this.#updateWallScale()
    }
    getScale() { return this.#scale; }
    setWallScale({x, y}) {
        const scale = new Vector2(x, y);
        this.#wallScale = scale;
        this.#updateWallScale();
    }
    getWallScale() { return this.#wallScale; }
    setWallSkewLeft(v) {
        if (typeof(v) !== 'number') return
        this.#wallSkewLeft = v;
        this.#walls.forEach(wall => wall.setSkewLeft(v))
    }  
    getWallSkewLeft() { return this.#wallSkewLeft }
    setWallSkewRight(v) {
        if (typeof(v) !== 'number') return
        this.#wallSkewRight = v;
        this.#walls.forEach(wall => wall.setSkewRight(v))
    }
    getWallSkewRight() { return this.#wallSkewRight }
    setWallAngleLeft(v) {
        if (typeof(v) !== 'number') return
        this.#wallAngleLeft = v;
        this.#walls.forEach(wall => wall.setLeftAngleOffset(v))
    }
    getWallAngleLeft() { return this.#wallAngleLeft }
    setWallAngleRight(v) {
        if (typeof(v) !== 'number') return
        this.#wallAngleRight = v;
        this.#walls.forEach(wall => wall.setRightAngleOffset(v))
    }
    getWallAngleRight() { return this.#wallAngleRight }
    setOffset({x, y}) {
        const offset = new Vector2(x, y);
        this.#offset = offset;
        this.#polygon.setOffset(offset);
        this.#background.setOffset(offset);
        this.#walls.forEach(wall => wall.setOffset(offset));
    }
    getOffset() { return this.#offset; }
    setCenterOffset({x, y}) {
        const offset = new Vector2(x, y);
        this.#centerOffset = offset;
        this.#polygon.setCenterOffset(offset);
        this.#background.setCenterOffset(offset);
        this.#walls.forEach(wall => wall.setCenterOffset(offset));
    }
    getCenterOffset() { return this.#centerOffset; }
    setBackgroundSwapTime(v) {
        if (typeof(v) !== 'number') return
        this.#background.setSwapTime(v)
    }
    getBackgroundSwapTime() { return this.#background.getSwapTime() }
    setBackgroundDarkenUnevenChunkEnabled(v) {
        this.#background.setDarkenUnevenChunkEnabled(v)
    }
    getBackgroundDarkenUnevenChunkEnabled() { return this.#background.getDarkenUnevenChunkEnabled() }
    setPlayerRotationOffset(v) {
        this.#polygon.player.setRotationOffset(v);
    }
    getPlayerRotationOffset() { return this.#polygon.player.getRotationOffset() }
    setPlayerSize({width, height}) {
        this.#polygon.player.setSize(new Size(width, height));
    }
    getPlayerSize() { return this.#polygon.player.getSize() }
    setPlayerDistanceMult(v) {
        this.#polygon.setPlayerDistanceMult(v);
    }
    getPlayerDistanceMult() { return this.#polygon.getPlayerDistanceMult() }

    clearWalls() {
        this.#walls.forEach(wall => wall.destroy());
        this.#walls = [];
    }
    destroy() {
        super.destroy();
        this.removeEventListeners();
        this.#died = true;
        cancelAnimationFrame(this.#updateId);
        requestAnimationFrame(() => {
            this.clearWalls();
            this.#polygon.destroy();
            this.#background.destroy();
            if (this.#deathEffect != undefined) this.#deathEffect.destroy();
        })
    }
    getWallCount() { return this.#walls.length }
    async distanceDelay(distance) {
        this.#distanceDelay = Math.max(distance, 1)
        return new Promise(resolve => {
            this.#distanceSignal = resolve;
        });
    }
}