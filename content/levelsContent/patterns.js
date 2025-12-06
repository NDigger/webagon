
import { getRandomSide, getRandomDir, getShift } from './utils'

const extraTunnelThickness = 40;
export default function initPatterns(level) {
    const barrage = side => {
        for(let i = 0; i < level.getSides() - 1; i++) {
            level.createWall(i + side, 40)
        }
    }

    const alt = async side => {
        for(let i = 0; i < level.getSides(); i+=2) {
            level.createWall(i + side, 40);
        }
    }

    const wallEx = async side => {
        if (level.getSides() % 2 === 0) {
            for(let i = 0; i < level.getSides()/2-1; i++) {
                level.createWall(i + side, 40);
                level.createWall(i + side + level.getSides()/2, 40);
            }
        } else {
            for(let i = 0; i < level.getSides()/2-1; i++) level.createWall(i + side, 40)
            for(let i = level.getSides()/2+1; i < level.getSides()-1; i++) level.createWall(i + side, 40)
        }
    }

    const pInverseBarrage = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide(level);
        for(let i = 0; i < times; i++) {
            barrage((i%2)*level.getSides()/2+side);
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide(level);
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            for(let k = 0; k < extra; k++) level.createWall((i+k) * dir + side, delay)
            await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pDoubleSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide(level);
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            for(let k = 0; k < extra; k++) {
                level.createWall((i+k) * dir + side, delay);
                level.createWall((i+k+level.getSides()/2) * dir + side, delay);
            }
            await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pDoubleInverseSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
        let side = getRandomSide(level);
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            side += dir;
            const mult = i === times - 1 ? 2 : 1
            for(let k = 0; k < extra; k++) {
                level.createWall(side+k, delay * mult);
                level.createWall(side+k+level.getSides()/2, delay * mult);
            }
            await level.distanceDelay(delay * mult);
        }
        for(let i = 0; i < times; i++) {
            side -= dir;
            for(let k = 0; k < extra; k++) {
                level.createWall(side+k, delay);
                level.createWall(side+k+level.getSides()/2, delay);
            }
            await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }


    const pSpiralBarrage = async (times, delay, delayEnd = 0, step = 1) => {
        const side = getRandomSide(level);
        const dir = getRandomDir();
        for(let i = 0; i < times; i++) {
            barrage(i * step * dir + side);
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pLeftRight = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide(level);
        for(let i = 0; i < times; i++) {
            if (i % 2 === 0) {
                barrage(side);
            } else {
                level.createWall(side - 1, 40)
            }
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pLRBarrage = async (times, delay, delayEnd = 0, step = 1) => {
        const side = getRandomSide(level);
        const shift = getShift();
        for (let i = 0; i < times; i++) {
            barrage(side + ((i+shift) % 2 === 0 ? step : 0));
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    } 

    const pWallExVortex = async (times, delay, delayEnd = 0) => {
        const side = getRandomSide(level);
        const dir = getRandomDir();
        let shift = 0;
        for (let i = 0; i < times; i++) {
            shift += dir;
            wallEx(side + shift);
            await level.distanceDelay(delay);
        }
        for (let i = 0; i < times - 1; i++) {
            shift -= dir;
            wallEx(side + shift);
            if (i !== times - 2) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pTunnel = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide(level);
        const shift = getShift();
        for(let i = 0; i < times; i++) {
            barrage(((i + shift) % 2 === 0) ? side : side - 1 - extra);
            if (i !== times - 1) {
                for (let k = 0; k < extra; k++) level.createWall(side - 2 - k, delay + extraTunnelThickness);
                await level.distanceDelay(delay);
            }
        }
        await level.distanceDelay(delayEnd);
    }

    const pAltTunnel = async (times, delay, delayEnd = 0, extra = 1) => {
        const side = getRandomSide(level);
        const shift = getShift();
        for(let i = 0; i < times; i++) {
            alt((i % 2 === 0) ? side + shift : side - 1 + shift);
            for (let k = 0; k < extra; k++) level.createWall(side - 2 + k, i !== times - 1 ? delay + extraTunnelThickness : 40);
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pWallExSpiral = async (times, delay, delayEnd, step = 1) => {
        const side = getRandomSide(level);
        const dir = getRandomDir();
        for (let i = 0; i < times; i++) {
            wallEx(i * step * dir + side);
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pAltSpam = async (times, delay, delayEnd) => {
        const side = getRandomSide(level);
        for (let i = 0; i < times; i++) {
            alt(side);
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pWallExSpam = async (times, delay, delayEnd) => {
        const side = getRandomSide(level);
        for (let i = 0; i < times; i++) {
            wallEx(side);
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pWallExTunnel = async (times, delay, delayEnd) => {
        const side = getRandomSide(level);
        const shift = getShift();
        for (let i = 0; i < times; i++) {
            wallEx((i + shift) % 2 === 0 ? side : side + 2);
            level.createWall(side, i !== times -1 ? delay + extraTunnelThickness : 40);
            level.createWall(side + level.getSides()/2, i !== times -1 ? delay + extraTunnelThickness : 40);
            if (i !== times - 1) await level.distanceDelay(delay)
        }
        await level.distanceDelay(delayEnd);
    }

    const pRandomLRBarrage = async (times, delay, delayEnd) => {
        let side = getRandomSide(level);
        for (let i = 0; i < times; i++) {
            side += getRandomDir();
            barrage(side);
            if (i !== times - 1) await level.distanceDelay(delay)
        }
        await level.distanceDelay(delayEnd)
    }

    const pRandomBarrage = async (times, delay, delayEnd) => {
        let side = getRandomSide(level);
        for (let i = 0; i < times; i++) {
            barrage(side);
            const inc = Math.floor(Math.random() * (level.getSides()/2))*getRandomDir();
            side += inc;
            if (i !== times - 1) await level.distanceDelay(Math.abs(inc) * delay / level.getSides() * 4 + 60)
        }
        await level.distanceDelay(delayEnd);
    }

    const pBarrageSpam = async (times, delay, delayEnd) => {
        const side = getRandomSide(level);
        for (let i = 0; i < times; i++) {
            barrage(side)
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    const pAltBarrage = async (times, delay, delayEnd) => {
        const side = getRandomSide(level);
        for (let i = 0; i < times; i++) {
            alt(side + i)
            if (i !== times - 1) await level.distanceDelay(delay);
        }
        await level.distanceDelay(delayEnd);
    }

    return {
        barrage,
        alt,
        wallEx,
        
        pAltBarrage,
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
        pDoubleInverseSpiral,
    }
}