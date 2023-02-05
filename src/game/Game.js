import { cellStatus } from '../constants/cell-status';
import { gameStatus } from '../constants/game-status';

export class Game {
    constructor(height, width, mines) {
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.flags = 0;
        this.remain = height * width - mines;

        // CREATE MAP
        this.map = [...Array(height)].map(() =>
            [...Array(width)].map(() => ({
                data: 0,
                status: cellStatus.CLOSED,
            }))
        );

        // create mines
        for (let i = 0; i < this.mines; i++) {
            let x = Math.floor(Math.random() * this.height);
            let y = Math.floor(Math.random() * this.width);

            while (this.map[x][y].data === -1) {
                x = Math.floor(Math.random() * this.height);
                y = Math.floor(Math.random() * this.width);
            }

            this.map[x][y].data = -1;
            for (const d of directions) {
                const x1 = x + d[0];
                const y1 = y + d[1];
                if (this.map[x1]?.[y1]?.data >= 0) {
                    this.map[x1][y1].data++;
                }
            }
        }
        console.log('construct');
    }

    revealMines() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const cell = this.map[i][j];
                if (cell.data === -1) {
                    cell.status = cellStatus.OPENED;
                } else if (cell.status === cellStatus.MARKED) {
                    cell.status = cellStatus.MISFLAGGED;
                }
            }
        }
    }

    openCell(line, col) {
        const cell = this.map[line]?.[col];

        if (!cell || cell.status !== cellStatus.CLOSED) {
            return;
        }

        cell.status = cellStatus.OPENED;
        if (cell.data === 0) {
            for (const d of directions) {
                const x1 = line + d[0];
                const y1 = col + d[1];
                this.openCell(x1, y1);
            }
        } else if (cell.data === -1) {
            this.revealMines();
            return gameStatus.LOSE;
        }

        this.remain--;
        if (this.remain <= 0) {
            this.revealMines();
            return gameStatus.WIN;
        }
    }

    markCell(line, col) {
        const cell = this.map[line]?.[col];

        if (!cell || (cell.status !== cellStatus.CLOSED && cell.status !== cellStatus.MARKED)) {
            console.log(cell, this.flags);
            return;
        }

        if (cell.status === cellStatus.MARKED) {
            cell.status = cellStatus.CLOSED;
            this.flags--;
            return;
        }

        if (this.flags >= this.mines) {
            return;
        }

        cell.status = cellStatus.MARKED;
        this.flags++;
        console.log(cell, this.flags);
    }
}

const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
];
