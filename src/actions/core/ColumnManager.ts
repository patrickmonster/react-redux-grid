import { SET_COLUMNS } from "../../constants/ActionTypes";

export const reorderColumn = ({
    draggedIndex,
    droppedIndex,
    columns,
    stateKey,
    stateful,
}: {
    draggedIndex: number;
    droppedIndex: number;
    columns: any[];
    stateKey: string;
    stateful: boolean;
}) => {
    const reorder = (cols: any[], to: number, from: number) => {
        cols.splice(to, 0, cols.splice(from, 1)[0]);
        return cols;
    };

    const reorderedColumns = reorder(columns, droppedIndex, draggedIndex);

    return {
        type: SET_COLUMNS,
        columns: reorderedColumns,
        stateKey,
        stateful,
    };
};
