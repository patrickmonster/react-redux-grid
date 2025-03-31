/* eslint-disable react/no-set-state */
import { List } from "immutable";
import React, { Component, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom";

import { PlaceHolder } from "@/components/layout/row/PlaceHolder";
import Row from "@/components/layout/table-row/Row";

import {
    BUFFER_MULTIPLIER,
    DEFAULT_VIEWABLE_RECORDS,
    ROW_HEIGHT,
} from "@/constants/GridConstants";

import { bufferBottom } from "@/util/buffer";
import { getCurrentRecords } from "@/util/getCurrentRecords";
import { getRowKey } from "@/util/getData";
import { isPluginEnabled } from "@/util/isPluginEnabled";

export type TableRowProps = {
    columnManager: object;
    columns: object[];
    containerHeight: number;
    containerScrollTop: number;
    data: object[];
    dataSource: object;
    dragAndDrop: boolean;
    editor: object;
    editorState: object;
    emptyDataMessage: string;
    events: object;
    gridType: GRID_TYPES;
    infinite: boolean;
    menuState: object;
    pageSize: number;
    pager: object;
    plugins: object;
    readFunc: (args: { parentId: string }) => void;
    reducerKeys: object | string;
    selectedRows: object;
    selectionModel: object;
    showTreeRootNode: boolean;
    stateKey: string;
    stateful: boolean;
    store: object;
};

export type GRID_TYPES = "grid" | "tree";
export default (props: TableRowProps) => {
    const {
        dataSource,
        infinite,
        columnManager,
        columns,
        dragAndDrop,
        editor,
        editorState,
        events,
        gridType,
        menuState,
        plugins,
        readFunc,
        reducerKeys,
        selectedRows,
        selectionModel,
        showTreeRootNode,
        stateKey,
        stateful,
        store,
        pager,
        pageSize,
    } = props;
    const [viewableIndex, setViewableIndex] = useState(0);
    const [viewableCount, setViewableCount] = useState(
        DEFAULT_VIEWABLE_RECORDS
    );

    const emptyDataMessage = props.emptyDataMessage || "No Data Available";

    const tbodyRef = React.createRef<HTMLTableSectionElement>();
    const [rowHeight, setRowHeight] = useState(ROW_HEIGHT);

    const infiniteSpacer = (method, totalCount) => {
        if (infinite && totalCount) {
            const style = {
                height: buffer[method](
                    rowHeight,
                    viewableIndex,
                    viewableCount,
                    BUFFER_MULTIPLIER,
                    totalCount
                ),
            };

            return <tr key={`row-inifinite-${method}`} style={style} />;
        }
    };

    const rowSelection = () => {
        if (!dataSource) return List();
        if (
            (!isPluginEnabled(plugins, "PAGER") && !infinite) ||
            (plugins.PAGER.pagingType === "remote" && !infinite)
        )
            return dataSource.data;

        return getCurrentRecords(
            dataSource,
            pager && pager.pageIndex ? pager.pageIndex : 0,
            pageSize,
            infinite,
            viewableIndex,
            viewableCount,
            BUFFER_MULTIPLIER
        ).data;
    };

    const totalCount =
        dataSource && List.isList(dataSource.currentRecords)
            ? dataSource.currentRecords.count()
            : 0;

    const calculateHeights = () => {
        const { CLASS_NAMES } = gridConfig();
        const { containerHeight } = this.props;
        const { rowHeight, viewableCount } = this.state;

        const tbody = ReactDOM.findDOMNode(this);

        const rows = tbody
            ? Array.from(tbody.querySelectorAll(`.${prefix(CLASS_NAMES.ROW)}`))
            : null;

        if (!rows || !rows?.length) {
            return;
        }

        const nextRowHeight = Math.round(
            rows?.reduce((prev, el) => prev + el.clientHeight, 0) / rows.length
        );

        const nextState = {};

        if (
            rowHeight !== nextRowHeight &&
            nextRowHeight !== undefined &&
            !Number.isNaN(nextRowHeight)
        )
            setRowHeight(nextRowHeight);

        const nextViewableCount = Math.ceil(containerHeight / rowHeight);

        if (
            nextViewableCount !== viewableCount &&
            !Number.isNaN(nextViewableCount)
        )
            setViewableCount(nextViewableCount);
    };
    const findRow = (predicate) => this._rows.find(predicate);

    const moveRow = (current, next) => {
        const { stateKey, store, showTreeRootNode } = this.props;
        if (!this.requestedFrame) {
            this.requestedFrame = requestAnimationFrame(() => {
                store.dispatch(
                    moveNode({
                        stateKey,
                        store,
                        current,
                        next,
                        showTreeRootNode,
                    })
                );
                this.requestedFrame = null;
            });
        }
    };

    const _rows = rowSelection();

    return (
        <DndProvider backend={HTML5Backend}>
            <tbody ref={tbodyRef}>
                {infiniteSpacer("bufferTop", totalCount)}
                {_rows.map((row, index, rows) => (
                    <Row
                        columnManager={columnManager}
                        columns={columns}
                        dragAndDrop={dragAndDrop}
                        editor={editor}
                        editorState={editorState}
                        emptyDataMessage={emptyDataMessage}
                        events={events}
                        findRow={findRow}
                        gridType={gridType}
                        index={index}
                        key={getRowKey(columns, row)}
                        menuState={menuState}
                        moveRow={moveRow}
                        nextRow={rows.get(index + 1)}
                        plugins={plugins}
                        previousRow={rows.get(index - 1)}
                        readFunc={readFunc}
                        reducerKeys={reducerKeys}
                        row={row}
                        selectedRows={selectedRows}
                        selectionModel={selectionModel}
                        showTreeRootNode={showTreeRootNode}
                        stateKey={stateKey}
                        stateful={stateful}
                        store={store}
                        treeData={getTreeData(row)}
                    />
                ))}
                {infinite && totalCount ? (
                    <tr
                        key={`row-inifinite-bufferBottom`}
                        style={{
                            height: bufferBottom(
                                rowHeight,
                                viewableIndex,
                                viewableCount,
                                BUFFER_MULTIPLIER,
                                totalCount
                            ),
                        }}
                    />
                ) : (
                    ""
                )}
                {!totalCount && (
                    <PlaceHolder emptyDataMessage={emptyDataMessage} />
                )}
            </tbody>
        </DndProvider>
    );
};

export class TableRow extends Component {
    componentDidMount() {
        this.calculateHeights();
    }

    componentWillReceiveProps(nextProps) {
        const { rowHeight } = this.state;

        if (this.props.containerScrollTop !== nextProps.containerScrollTop) {
            this.setState({
                viewableIndex: Math.floor(
                    nextProps.containerScrollTop / rowHeight
                ),
            });
        }
    }

    componentDidUpdate() {
        this.calculateHeights();
    }

    constructor(props) {
        super(props);

        this.state = {
            viewableIndex: 0,
            rowHeight: ROW_HEIGHT,
            viewableCount: DEFAULT_VIEWABLE_RECORDS,
        };
    }
}

export const getTreeData = (row) => ({
    depth: row.get("_depth"),
    parentId: row.get("_parentId"),
    id: row.get("_id"),
    index: row.get("_index"),
    flatIndex: row.get("_flatIndex"),
    leaf: row.get("_leaf"),
    hasChildren: row.get("_hasChildren"),
    isExpanded: row.get("_isExpanded"),
    isLastChild: row.get("_isLastChild"),
    isFirstChild: row.get("_isFirstChild"),
    previousSiblingId: row.get("_previousSiblingId"),
    previousSiblingTotalChildren: row.get("_previousSiblingTotalChilden"),
    previousSiblingChildIds: row.get("_previousSiblingChildIds"),
    parentTotalChildren: row.get("_parentTotalChildren"),
    parentIndex: row.get("_parentIndex"),
    indexPath: row.get("_indexPath"),
    path: row.get("_path"),
});
