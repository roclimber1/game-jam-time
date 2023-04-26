

export enum CUSTOM_EVENT {
    ACTION = 'ACTION',
    CONNECT = 'CONNECT',
    GAME_OVER_MOVES_LIMIT = 'GAME_OVER_MOVES_LIMIT',
    OPPONENT = 'OPPONENT',
    OPPONENT_FLED = 'OPPONENT_FLED',
    SET_MAP = 'SET_MAP',
    TURN = 'TURN',
    WAITING = 'WAITING'
}



export const TEXTS = {
    YOU_WIN: 'You win!',
    YOU_LOSE: 'You lose!',
    OPPONENT_FLED: 'Your opponent fled the battlefield 😶‍🌫️! Your tactic skills scared him away!',
    START_NEW_GAME: 'Start a new game 🕹️',
    YOUR_SCORE: 'Your score',
    OPPONENT_SCORE: 'Your opponent\'s score',
    GAME_OVER_MOVES_LIMIT: 'The game is over due to the move amount limitation!',
    YOU_WIN_POINTS: 'You win! You have more points than your opponent! 💫',
    YOU_LOSE_POINTS:'You lose! You have less points than your opponent!',
    DRAW_POINTS:'It is a draw! You have the same amount of points as your opponent!',
    TRY_AGAIN: 'Try again 🕹️'
}





export enum ICON {
    MOVE = 'icon-move',
    STONE = 'icon-stone',
    STONE_GATHERING = 'icon-stone-gathering',
    TRAP = 'icon-trap',
    WOOD = 'icon-wood',
    WOOD_GATHERING = 'icon-wood-gathering'
}




export const ICONS: Array<ICON> = [
    ICON.MOVE,
    ICON.STONE,
    ICON.STONE_GATHERING,
    ICON.TRAP,
    ICON.WOOD,
    ICON.WOOD_GATHERING
]
