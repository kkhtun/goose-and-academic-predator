export const updatePlayerPos = (gameInfo, playerUniqueId, pos) => {
    const { players } = gameInfo;
    return {
        ...gameInfo,
        players: players.map((p) => {
            if (p.playerUniqueId === playerUniqueId) {
                return { ...p, playerPos: pos };
            }
            return p;
        }),
    };
};

export const findPlayer = (gameInfo, playerUniqueId) => {
    return gameInfo.players.find((p) => p.playerUniqueId === playerUniqueId);
};
