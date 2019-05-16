import seedRandom from 'seedrandom';

// eslint-disable-next-line prefer-destructuring
const random = Math.random; // seedRandom('i am the seed'); // keeps the game deterministic

export function range(min, max) {
    return random() * (max ? (max - min) : min) + (max ? min : 0);
}

export function generateRandomCoordWithinCanvas(height, width, xMin = 0, yMin = 0) {
    let randX = range(0, width);
    let randY = range(0, height);

    while (!(
        randX < (0 + xMin) || randX > (width - xMin) ||
        randY < (0 + yMin) || randY > (height - yMin)
    )) {
        randX = range(0, width);
        randY = range(0, height);
    }

    return {
        x: randX,
        y: randY,
    };
}
