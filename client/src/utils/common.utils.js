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

// export const getBoxIcon = () => {
//     switch (type) {
//         case POSITION_TYPE.GOOSE:
//             return (
//                 <span>
//                     <img src={GooseIcon} alt="goose" width={18} height={18} />
//                 </span>
//             );

//         case POSITION_TYPE.CHALLENGE:
//             return <>❓</>;

//         case POSITION_TYPE.INFO:
//             return <>ℹ️</>;

//         case POSITION_TYPE.JUMP_TURN:
//             return <>⏭️</>;

//         case POSITION_TYPE.DICE_TWICE:
//             return <>🎲</>;

//         case POSITION_TYPE.BACK_TO_START:
//             return <>🔁</>;

//         case POSITION_TYPE.LUCKY:
//             return <>🍀</>;

//         case POSITION_TYPE.PENALTY:
//             return <>🐊</>;

//         default:
//             return <></>;
//     }
// };
