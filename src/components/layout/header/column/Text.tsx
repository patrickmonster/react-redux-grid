import { useContext } from "react";

import { GridContext } from "@/components/Grid";
import { gridConfig } from "@/constants/GridConstants";
import { Column as ColumnType } from "@/type/columns";
import { keyFromObject } from "@/util/keyGenerator";
import { prefix } from "@/util/prefix";

import DragAndDropManager from "@/components/core/draganddrop/DragAndDropManager";

export type TextProps = {
    actualIndex: number;
    col: ColumnType;
} & React.PropsWithChildren;

export const Text = ({ actualIndex, col, children }: TextProps) => {
    const { config } = useContext(GridContext);
    const { CLASS_NAMES } = gridConfig();
    const draggable =
        col.moveable !== undefined ? col.moveable : config.moveable;

    return (
        <DragAndDropManager
            as="span"
            draggable={draggable}
            className={
                draggable
                    ? prefix(CLASS_NAMES.DRAGGABLE_COLUMN, CLASS_NAMES.COLUMN)
                    : prefix(CLASS_NAMES.COLUMN)
            }
            onDrag={() => {}}
            onDragStart={(reactEvent) => {
                const data = {
                    key: keyFromObject(col),
                    index: actualIndex,
                };
                reactEvent.dataTransfer.setData("Text", JSON.stringify(data));
            }}
        >
            {col.name}
            {children}
        </DragAndDropManager>
    );
};
