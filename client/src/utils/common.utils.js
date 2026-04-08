import { BOARD_SIZE } from "../constants";

export const getPlayerMovementPath = (currentPos, nextPos, steps) => {
    const finalPos = BOARD_SIZE - 1; // We have 91 positions including start
    const path = [];

    let pos = currentPos;
    let direction = steps >= 0 ? 1 : -1;
    const totalSteps = Math.abs(steps); // We can determine it directly since each move is for a single jump (regardless of the roll)

    for (let i = 0; i < totalSteps; i++) {
        pos += direction;
        // Bounce at end
        if (pos > finalPos) {
            pos = finalPos - 1;
            direction = -1;
        }

        // Bounce at start
        if (pos < 0) {
            pos = 1;
            direction = 1;
        }

        path.push(pos);
    }
    return path;
};

// The idea is that each individual move will call this
// The moving player will have a playerPath
export const updatePlayerPos = (
    gameInfo,
    playerUniqueId,
    currentPos,
    newPos,
    steps,
) => {
    const { players } = gameInfo;

    return {
        ...gameInfo,
        players: players.map((p) => {
            if (p.playerUniqueId === playerUniqueId) {
                return {
                    ...p,
                    playerPos: newPos,
                    // Only this player gets path
                    // This is to solve rewind issues near the end (pos 90)
                    playerPath: getPlayerMovementPath(
                        currentPos,
                        newPos,
                        steps,
                    ),
                };
            }

            return {
                ...p,
                playerPath: null,
            };
        }),
    };
};

// export const updatePlayerPos = (gameInfo, playerUniqueId, pos) => {
//     const { players } = gameInfo;
//     return {
//         ...gameInfo,
//         players: players.map((p) => {
//             if (p.playerUniqueId === playerUniqueId) {
//                 return { ...p, playerPos: pos };
//             }
//             return p;
//         }),
//     };
// };

export const findPlayer = (gameInfo, playerUniqueId) => {
    return gameInfo.players.find((p) => p.playerUniqueId === playerUniqueId);
};
