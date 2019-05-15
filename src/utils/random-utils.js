export const range = (min, max) => Math.random() * (max ? (max - min) : min) + (max ? min : 0);

export const generateRandomCoordWithinCanvas = (height, width) => {
    const randX = range(0, width);
    const randY = range(0, height);

    return {
        x: randX,
        y: randY,
    };
};
