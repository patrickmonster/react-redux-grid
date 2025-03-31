import { gridConfig } from "@/constants/GridConstants";
import { keyFromObject } from "@/util/keyGenerator";
import { prefix } from "@/util/prefix";

export type TextProps = {
    actualIndex: number;
    col: {
        name: string;
        moveable?: boolean;
        defaultSortDirection?: string;
        sortDirection?: string;
        dataIndex: string;
        hidden?: boolean;
        sortMethod?: (a: any, b: any) => number;
    };
    columnManager: {
        config: {
            moveable: boolean;
        };
    };
    dragAndDropManager: {
        initDragable: (props: {
            draggable: boolean;
            className: string;
            onDrag: () => void;
            onDragStart: (event: React.DragEvent) => void;
        }) => any;
    };
    sortHandle: React.ReactNode;
};

export const Text = ({
    actualIndex,
    col,
    columnManager,
    dragAndDropManager,
    sortHandle,
}: TextProps) => {
    const { CLASS_NAMES } = gridConfig();
    const innerHTML = col.name;
    const draggable =
        col.moveable !== undefined
            ? col.moveable
            : columnManager.config.moveable;

    const spanProps = dragAndDropManager.initDragable({
        draggable: draggable,
        className: draggable
            ? prefix(CLASS_NAMES.DRAGGABLE_COLUMN, CLASS_NAMES.COLUMN)
            : prefix(CLASS_NAMES.COLUMN),
        onDrag: () => {},
        onDragStart: (reactEvent) => {
            const data = {
                key: keyFromObject(col),
                index: actualIndex,
            };
            reactEvent.dataTransfer.setData("Text", JSON.stringify(data));
        },
    });

    return (
        <span {...spanProps}>
            {innerHTML}
            {sortHandle}
        </span>
    );
};
