import {DIRECTIONS, OBJECT_TYPE} from './setup.js';

// Random Movement (Just for use as a prototype)
export function randomMovement(position, direction, objectExist)
{
    let dir = direction;
    let nextMovePos = position + dir.movement;
    // Create an array from the directions object leys
    const keys = Object.keys(DIRECTIONS);

    while (
        objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)
    ){
        // Get a random key from the key array
        const key = keys[Math.floor(Math.random() * keys.length)];
        // Set the next move
        dir = DIRECTIONS[key];
        // Set the next move
        nextMovePos = position + dir.movement;
    }
    return {nextMovePos, direction: dir};
}