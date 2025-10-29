
const getRandomDir = () => Math.random() < .5 ? -1 : 1;
const getShift = () => Math.floor(Math.random() * 2);
const extraTunnelThickness = 40;
export default function initPatterns(g) {
    const getRandomSide = () => Math.floor(Math.random() * g.getSides());

    const barrage = side => {
        for(let i = 0; i < g.getSides() - 1; i++) {
            g.createWall(i + side, 40)
        }
    }

    const alt = async side => {
        for(let i = 0; i < g.getSides(); i+=2) {
            g.createWall(i + side, 40);
        }
    }

    const wallEx = async side => {
        if (g.getSides() % 2 === 0) {
            for(let i = 0; i < g.getSides()/2-1; i++) {
                g.createWall(i + side, 40);
                g.createWall(i + side + g.getSides()/2, 40);
            }
        } else {
            for(let i = 0; i < g.getSides()/2-1; i++) g.createWall(i + side, 40)
            for(let i = g.getSides()/2+1; i < g.getSides()-1; i++) g.createWall(i + side, 40)
        }
    }

    const pInverseBarrage = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide();
        for(let i = 0; i < times; i++) {
            barrage((i%2)*g.getSides()/2+side);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide();
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            for(let k = 0; k < extra; k++) g.createWall((i+k) * dir + side, delay)
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pDoubleSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide();
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            for(let k = 0; k < extra; k++) {
                g.createWall((i+k) * dir + side, delay);
                g.createWall((i+k+g.getSides()/2) * dir + side, delay);
            }
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pSpiralBarrage = async (times, delay, delayEnd = 0, step = 1) => {
        const side = getRandomSide();
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            barrage(i * step * dir + side);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pLeftRight = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide();
        for(let i = 0; i < times; i++) {
            if (i % 2 === 0) {
                barrage(side);
            } else {
                g.createWall(side - 1, 40)
            }
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pLRBarrage = async (times, delay, delayEnd = 0, step = 1) => {
        const side = getRandomSide();
        const shift = getShift();
        for (let i = 0; i < times; i++) {
            barrage(side + ((i+shift) % 2 === 0 ? step : 0));
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    } 

    const pWallExVortex = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide();
        const dir = getRandomDir();
        let shift = 0;
        for (let i = 0; i < times; i++) {
            shift += dir;
            wallEx(side + shift);
            await g.distanceDelay(delay);
        }
        for (let i = 0; i < times - 1; i++) {
            shift -= dir;
            wallEx(side + shift);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pTunnel = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide();
        const shift = getShift();
        for(let i = 0; i < times; i++) {
            barrage(((i + shift) % 2 === 0) ? side : side - 2);
            if (i !== times - 1) {
                g.createWall(side - 2, delay + extraTunnelThickness);
                await g.distanceDelay(delay);
            }
        }
        await g.distanceDelay(delayEnd);
    }

    const pAltTunnel = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide();
        const shift = getShift();
        for(let i = 0; i < times; i++) {
            alt((i % 2 === 0) ? side + shift : side - 1 + shift);
            for (let k = 0; k < extra; k++) g.createWall(side - 2 + k, i !== times - 1 ? delay + extraTunnelThickness : 40);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pWallExSpiral = async (times, delay, delayEnd, step = 1) => {
        const side = getRandomSide();
        const dir = getRandomDir();
        for (let i = 0; i < times; i++) {
            wallEx(i * step * dir + side);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pAltSpam = async (times, delay, delayEnd) => {
        const side = getRandomSide();
        for (let i = 0; i < times; i++) {
            alt(side);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pWallExSpam = async (times, delay, delayEnd) => {
        const side = getRandomSide();
        for (let i = 0; i < times; i++) {
            wallEx(side);
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    const pWallExTunnel = async (times, delay, delayEnd) => {
        const side = getRandomSide();
        const shift = getShift();
        for (let i = 0; i < times; i++) {
            wallEx((i + shift) % 2 === 0 ? side : side + 2);
            g.createWall(side, i !== times -1 ? delay + extraTunnelThickness : 40);
            g.createWall(side + g.getSides()/2, i !== times -1 ? delay + extraTunnelThickness : 40);
            await g.distanceDelay(delay)
        }
        await g.distanceDelay(delayEnd);
    }

    const pRandomLRBarrage = async (times, delay, delayEnd) => {
        let side = getRandomSide();
        for (let i = 0; i < times; i++) {
            side += getRandomDir();
            barrage(side);
            await g.distanceDelay(delay)
        }
        await g.distanceDelay(delayEnd)
    }

    const pRandomBarrage = async (times, delay, delayEnd) => {
        let side = getRandomSide();
        for (let i = 0; i < times; i++) {
            barrage(side);
            const inc = Math.floor(Math.random() * (g.getSides()/2))*getRandomDir();
            side += inc;
            if (i !== times - 1) await g.distanceDelay(Math.abs(inc) * delay + 60)
        }
        await g.distanceDelay(delayEnd);
    }

    const pBarrageSpam = async (times, delay, delayEnd) => {
        const side = getRandomSide();
        for (let i = 0; i < times; i++) {
            barrage(side)
            await g.distanceDelay(delay);
        }
        await g.distanceDelay(delayEnd);
    }

    return {
        pInverseBarrage,
        pSpiral,
        pDoubleSpiral,
        pSpiralBarrage,
        pLeftRight,
        pLRBarrage,
        pWallExSpam,
        pAltSpam,
        pTunnel,
        pAltTunnel,
        pWallExSpiral,
        pWallExVortex,
        pWallExTunnel,
        pRandomLRBarrage,
        pRandomBarrage,
        pBarrageSpam,
    }
}