import { cellStatus } from '../constants/cell-status';

export function Cell({ data, status, onClick, onRightClick }) {
    let className = `cell`;
    if (status === cellStatus.OPENED || status === cellStatus.CLICKED) {
        className = `cell ${status === cellStatus.CLICKED ? 'clicked' : ''} value${data}`;
    } else if (status === cellStatus.MARKED) {
        className = 'cell marked';
    } else if (status === cellStatus.MISFLAGGED) {
        className = 'cell misflagged';
    }

    const handleRightClick = (e) => {
        console.log('right clicked');
        e.preventDefault();
        onRightClick?.();
    };

    return <div className={className} onClick={onClick} onContextMenu={handleRightClick}></div>;
}
