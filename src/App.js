import { useEffect, useState } from 'react';
import './App.css';
import { Cell } from './components/Cell';
import { Digits } from './components/Digits';
import { cellStatus } from './constants/cell-status';
import { difficultyLevels } from './constants/difficulty-levels';
import { gameStatus } from './constants/game-status';
import { Game } from './game/Game';

function App() {
    const [game, setGame] = useState({ ...difficultyLevels[0], status: gameStatus.PLAYING });
    const [map, setMap] = useState({ game });

    useEffect(() => {
        if (game.status === gameStatus.PLAYING) {
            console.log('new');
            const gameMap = new Game(game.height, game.width, game.mines);
            setMap({
                game: gameMap,
            });
        }
        // eslint-disable-next-line
    }, [game]);

    const changeLevel = (level) => {
        setGame({
            ...level,
            status: gameStatus.PLAYING,
        });
    };

    const handleCellClick = (line, col) => {
        if (game.status !== gameStatus.PLAYING) {
            return;
        }
        const status = map.game.openCell(line, col);
        if (map.game.map[line][col].status === cellStatus.OPENED) {
            map.game.map[line][col].status = cellStatus.CLICKED;
        }
        setMap({ game: map.game });
        if (status) handleEndgame(status);
    };

    const handleRightClick = (line, col) => {
        if (game.status !== gameStatus.PLAYING) {
            return;
        }
        map.game.markCell(line, col);
        setMap({ game: map.game });
    };

    const handleEndgame = (status) => {
        setGame({
            ...game,
            status,
        });
    };

    const handleNewGame = () => {
        setGame({
            ...game,
            status: gameStatus.PLAYING,
        });
    };

    const gameMap = map.game?.map || [[]];

    return (
        <div className="App">
            <div className="level-selection">
                <div className="inner">
                    {difficultyLevels.map((level, i) => (
                        <div
                            className={`level ${game.level === level.level ? 'active' : ''}`}
                            onClick={() => changeLevel(level)}
                        >
                            {level.level}
                        </div>
                    ))}
                </div>
            </div>

            <div className="game-board">
                <div className="status-bar">
                    <Digits value={game.mines} />
                    <div className={`game-button ${game.status}`} onClick={handleNewGame}></div>
                    <Digits value={map.game.flags} />
                </div>
                <div className="game-map">
                    {gameMap.map((e, line) => (
                        <div className="line" key={line}>
                            {e.map((cell, col) => (
                                <Cell
                                    key={`${line}${col}`}
                                    data={cell.data}
                                    status={cell.status}
                                    onClick={() => handleCellClick(line, col)}
                                    onRightClick={() => handleRightClick(line, col)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div></div>
        </div>
    );
}

export default App;
