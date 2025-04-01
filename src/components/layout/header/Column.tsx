import { keyGenerator } from "@/util/keyGenerator";
import { prefix } from "@/util/prefix";

import { Column as ColumnType } from "@/type/columns";

import {
    gridConfig,
    SORT_DIRECTIONS,
    SORT_METHODS,
} from "@/constants/GridConstants";

import { reorderColumn } from "@/actions/core/ColumnManager";
import { setSortDirection } from "@/actions/GridActions";
import { GridContext } from "@/components/Grid";
import { useCallback, useContext, useEffect, useState } from "react";

import DragAndDropManager from "@/components/core/draganddrop/DragAndDropManager";
import { Text as TextElement } from "./column/Text";

const isChrome =
    navigator &&
    /Chrome/.test(navigator.userAgent) &&
    /Google Inc/.test(navigator.vendor);

export type ColumnProps = {
    actualIndex: number;
    col: ColumnType;
    dragAndDropManager: object;
    filterFields: object;
    index: number;
    pageSize: number;
    pager: object;
    scope: object;
    stateKey: string;
    stateful: boolean;
    store: object;
};

export const Column = ({
    actualIndex,
    scope,
    col,
    dragAndDropManager,
    stateKey,
    index,
    stateful,
}: ColumnProps) => {
    const { config, columns } = useContext(GridContext);
    if (col.hidden) return false;

    const { CLASS_NAMES } = gridConfig();

    const [isResizable, setIsResizable] = useState(false);
    const [isSortable, setIsSortable] = useState(false);

    const visibleColumns = columns?.filter((c) => !c.hidden);
    const sortedColumn = columns?.find((c) => c.sortDirection);

    const shouldShowCaret = sortedColumn
        ? sortedColumn.dataIndex === col.dataIndex
        : col.defaultSortDirection;

    const key = keyGenerator(col.name, "grid-column");

    const nextColumnKey =
        visibleColumns && visibleColumns[index + 1]
            ? keyGenerator(visibleColumns[index + 1].name, "grid-column")
            : null;

    const handleDrag = scope.handleDrag.bind(
        scope,
        scope,
        columns,
        key,
        nextColumnKey,
        stateKey,
        stateful
    );

    const getWidth = () => {
        // const { config, columns } = useContext(GridContext);
        const visibleColumns = columns.filter((_col) => !_col.hidden) || [];
        const lastColumn = visibleColumns[visibleColumns.length - 1];
        const isLastColumn = lastColumn && lastColumn.name === col.name;
        const totalWidth = columns.reduce((a, _col) => {
            if (_col.hidden) {
                return a + 0;
            }
            return a + parseFloat(_col.width || config.defaultColumnWidth);
        }, 0);

        let width = col.width || config.defaultColumnWidth;

        if (isLastColumn && totalWidth !== 0 && totalWidth < 100) {
            width = `${100 - (totalWidth - parseFloat(width))}%`;
        }

        return width;
    };

    useCallback(() => {
        if (
            col.sortable ||
            (config.sortable.enabled && col.sortable !== false)
        ) {
            handleSort(columns, col, stateKey, store);
        }

        if (typeof col.HANDLE_CLICK === "function") {
            col.HANDLE_CLICK(
                {
                    columns,
                    column: col,
                    sortDirection: direction,
                },
                null
            );
        }
    }, []);

    useEffect(() => {
        const { config } = useContext(GridContext);
        if (col.resizable !== undefined) {
            setIsResizable(col.resizable);
        } else if (config.resizable !== undefined) {
            setIsResizable(config.resizable);
        }
        setIsResizable(config.defaultResizable);
    }, [col.resizable, config.resizable]);

    useEffect(() => {
        const { config } = useContext(GridContext);
        if (col.sortable !== undefined) {
            setIsSortable(col.sortable);
        } else if (config.sortable !== undefined) {
            setIsSortable(config.sortable);
        }
        setIsSortable(config.defaultSortable);
    }, [col.sortable, config.sortable]);

    return (
        <th
            key={key}
            className={[
                col.className
                    ? `${col.className} ${
                          isResizable ? prefix("resizable") : ""
                      }`
                    : `${isResizable ? prefix("resizable") : ""}`,
                shouldShowCaret ? prefix(CLASS_NAMES.SORT_HANDLE_VISIBLE) : "",
                col.sortable ? prefix("is-sortable") : "",
                index === 0 ? prefix("is-first-column") : "",
            ]
                .filter((t) => t)
                .join(" ")}
            style={{
                width: getWidth(),
            }}
            onClick={handleColumnClick.bind(scope, clickArgs)}
            onDragOver={(reactEvent) => {
                if (!isChrome && "reactGridXcoord" in window)
                    window.reactGridXcoord = reactEvent.clientX;
                reactEvent.preventDefault();
            }}
        >
            {
                <TextElement actualIndex={actualIndex} col={col}>
                    {isSortable && (
                        <SortHandle
                            {...{
                                col,
                                columns,
                                columnManager,
                                dataSource,
                                direction,
                                pager,
                                sortHandleCls,
                                store,
                            }}
                        />
                    )}
                </TextElement>
            }
            {isResizable ? (
                <DragAndDropManager
                    as="span"
                    draggable
                    handleDrag={handleDrag}
                />
            ) : null}
        </th>
    );
};

export const handleDrop = (
    droppedIndex,
    columns,
    stateful,
    stateKey,
    store,
    reactEvent
) => {
    reactEvent.preventDefault();
    try {
        const colData =
            reactEvent && reactEvent.dataTransfer.getData
                ? JSON.parse(reactEvent.dataTransfer.getData("Text"))
                : null;

        if (colData) {
            store.dispatch(
                reorderColumn({
                    draggedIndex: colData.index,
                    droppedIndex: droppedIndex,
                    columns,
                    stateKey,
                    stateful,
                })
            );
        }
    } catch (e) {
        /* eslint-disable no-console */
        console.warn("Invalid drop");
        /* eslint-enable no-console */
    }
};

export const handleSort = (
    columns,
    col,
    columnManager,
    dataSource,
    direction,
    filterFields,
    pageSize,
    pager,
    stateKey,
    store
) => {
    const newDirection =
        direction === SORT_DIRECTIONS.ASCEND
            ? SORT_DIRECTIONS.DESCEND
            : SORT_DIRECTIONS.ASCEND;

    store.dispatch(
        setSortDirection({
            columns,
            id: col.id,
            sortDirection: newDirection,
            stateKey,
        })
    );

    if (
        columnManager.config.sortable.method.toUpperCase() ===
        SORT_METHODS.LOCAL
    ) {
        columnManager.doSort({
            method: SORT_METHODS.LOCAL,
            column: col,
            direction: newDirection,
            dataSource,
            filterFields,
            pageSize,
            pagerState: null,
            stateKey,
        });
    } else if (
        columnManager.config.sortable.method.toUpperCase() ===
        SORT_METHODS.REMOTE
    ) {
        columnManager.doSort({
            method: SORT_METHODS.REMOTE,
            column: col,
            direction: newDirection,
            dataSource,
            filterFields,
            pageSize,
            pagerState: pager,
            stateKey,
        });
    } else {
        /* eslint-disable no-console */
        console.warn("Sort method not defined!");
        /* eslint-enable no-console */
    }
};

export const handleColumnClick = ({
    columns,
    col,
    columnManager,
    dataSource,
    direction,
    filterFields,
    pageSize,
    pager,
    stateKey,
    store,
}) => {
    if (
        col.sortable ||
        (columnManager &&
            columnManager.config &&
            columnManager.config.sortable &&
            columnManager.config.sortable.enabled &&
            col.sortable !== false)
    ) {
        handleSort(
            columns,
            col,
            columnManager,
            dataSource,
            direction,
            filterFields,
            pageSize,
            pager,
            stateKey,
            store
        );
    }

    if (typeof col.HANDLE_CLICK === "function") {
        col.HANDLE_CLICK(
            {
                columns,
                column: col,
                sortDirection: direction,
            },
            null
        );
    }
};

export const isSortable = (col: Column, columnManager) => {
    if (col.sortable !== undefined) {
        return col.sortable;
    } else if (columnManager.config.sortable.enabled !== undefined) {
        return columnManager.config.sortable.enabled;
    }

    return columnManager.config.defaultSortable;
};
