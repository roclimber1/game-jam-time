

export enum CUSTOM_EVENT {
    ACTION = 'ACTION',
    CONNECT = 'CONNECT',
    GAME_OVER_MOVES_LIMIT = 'GAME_OVER_MOVES_LIMIT',
    GAME_OVER_WINNER = 'GAME_OVER_WINNER',
    OPPONENT = 'OPPONENT',
    OPPONENT_FLED = 'OPPONENT_FLED',
    SET_MAP = 'SET_MAP',
    TURN = 'TURN',
    WAITING = 'WAITING'
}



export const TEXTS = {
    DRAW_POINTS:'It is a draw! You have the same amount of points as your opponent!',
    GAME_OVER_MOVES_LIMIT: 'The game is over due to the move amount limitation!',
    GAME_OVER_OPPONENT_WINNER: 'Your opponent reached the opposite side of the board!',
    GAME_OVER_YOU_WINNER: 'You reached the opposite side of the board! 🎉',
    OPPONENT_FLED: 'Your opponent fled the battlefield 😶‍🌫️! Your tactic skills scared him away!',
    OPPONENT_SCORE: 'Your opponent\'s score',
    START_NEW_GAME: 'Start a new game 🕹️',
    TRY_AGAIN: 'Try again 🕹️',
    YOU_LOSE_POINTS:'You lose! You have less points than your opponent!',
    YOU_LOSE: 'You lose!',
    YOU_WIN_POINTS: 'You win! You have more points than your opponent! 💫',
    YOU_WIN: 'You win!',
    YOUR_SCORE: 'Your score'
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
