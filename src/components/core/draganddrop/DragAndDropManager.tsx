import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";
import { DragEventHandler } from "react";

export type DragHandleProps<T extends Element> = {
    as?: "span" | "div";
    onDragStart?: DragEventHandler<T>;
    onDrag?: DragEventHandler<T>;
    onDragOver?: DragEventHandler<T>;
    onDragLeave?: DragEventHandler<T>;
    onDragEnd?: DragEventHandler<T>;
    onDrop?: DragEventHandler<T>;
} & React.HTMLAttributes<HTMLDivElement> &
    React.ClassAttributes<HTMLDivElement> &
    React.PropsWithChildren;

export default (props: DragHandleProps<HTMLDivElement>) => {
    const { CLASS_NAMES } = gridConfig();

    const Element = props.as || "div";

    return (
        <Element
            className={props.className || prefix(CLASS_NAMES.DRAG_HANDLE)}
            draggable={props.draggable}
            onDragStart={(reactEvent) => {
                if (!props.onDragStart) {
                    const { dataTransfer } = reactEvent;
                    dataTransfer.setData(
                        "Text",
                        JSON.stringify({ preventBubble: true, validDrag: true })
                    );
                    /**
                     * hiding the chrome default drag image -- go upvote this
                     * 7680285/how-do-you-turn-off-setdragimage
                     **/

                    const dragIcon = document.createElement("img");
                    dragIcon.src =
                        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // eslint-disable-line max-len

                    if (dataTransfer.setDragImage) {
                        dataTransfer.setDragImage(dragIcon, -10, -10);
                    }
                } else props.onDragStart(reactEvent);
            }}
            onDrag={props.onDrag}
            onDragOver={props.onDragOver}
            onDragLeave={(reactEvent) => {
                if (!props.onDragLeave) reactEvent.preventDefault();
                else props.onDragLeave(reactEvent);
            }}
            onDragEnd={(reactEvent) => {
                if (!props.onDragEnd) reactEvent.preventDefault();
                else props.onDragEnd(reactEvent);
            }}
            onDrop={(reactEvent) => {
                if (!props.onDrop) {
                    reactEvent.preventDefault();
                    const eventType = JSON.parse(
                        reactEvent.dataTransfer.getData("Text")
                    );

                    if (eventType && eventType.preventBubble)
                        reactEvent.stopPropagation();
                } else props.onDrop(reactEvent);
            }}
        >
            {props.children}
            {/* This is a placeholder for the drag handle icon */}
            <span className={prefix(CLASS_NAMES.DRAG_HANDLE)} />
        </Element>
    );
};
