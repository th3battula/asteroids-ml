import seedRandom from 'seedrandom';

const random = seedRandom('i am the seed'); // keeps the game deterministic

export function range(min, max) {
    return random() * (max ? (max - min) : min) + (max ? min : 0);
}

export function generateRandomCoordWithinCanvas(height, width) {
    const randX = range(0, width);
    const randY = range(0, height);

    return {
        x: randX,
        y: randY,
    };
};
