import { MIN_GRID_SIZE, MAX_GRID_SIZE } from '@/features/game/utils/game-utils';

interface GridSelectorProps {
    gridSize: number;
    onChange: (size: number) => void;
}

const GridSelector = ({ gridSize, onChange }: GridSelectorProps) => (
    <div className="grid-selector">
        <label htmlFor="grid-size-input">Grid: {gridSize} × {gridSize}</label>
        <input
            id="grid-size-input"
            type="range"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={gridSize}
            onChange={(e) => onChange(Number(e.target.value))}
        />
    </div>
);

export default GridSelector;
