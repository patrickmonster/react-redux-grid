import PropTypes from "prop-types";
import { Component } from "react";

import { Column } from "@/components/layout/header/Column";
import { EmptyHeader } from "@/components/layout/header/EmptyHeader";

import { gridConfig } from "../../constants/GridConstants.js";
import { keyFromObject } from "../../util/keyGenerator";
import { prefix } from "../../util/prefix";
import { shouldHeaderUpdate } from "../../util/shouldComponentUpdate";
import DragAndDropManager from "../core/draganddrop/DragAndDropManager";

const { arrayOf, bool, object, string, oneOfType } = PropTypes;

const dragAndDropManager = new DragAndDropManager();

export type HeaderProps = {
    columnManager: any;
    columns: any[];
    dataSource: any;
    pager: any;
    plugins: any;
    reducerKeys: any;
    selectionModel: any;
    stateKey: string;
    store: any;
    visible: boolean;
};

export const handleDrag = () => false;

/**
 * Header component
 * @class Header
 * @extends Component
 */
export default (props: HeaderProps) => {
    const {
        columns,
        columnManager,
        dataSource,
        selectionModel,
        reducerKeys,
        store,
        stateKey,
        pager,
        plugins,
        visible,
    } = props;
    const { CLASS_NAMES } = gridConfig();

    const visibleColumns = columns.filter((col) => !col.hidden);
    const headers = visibleColumns.map((col, i) => (
        <Column
            col={col}
            columnManager={columnManager}
            columns={columns}
            dataSource={dataSource}
            dragAndDropManager={dragAndDropManager}
            index={i}
            key={`header-${i}`}
            pager={pager}
            scope={this}
            store={store}
            visibleColumns={visibleColumns}
        />
    ));

    const classes = visible
        ? prefix(CLASS_NAMES.HEADER)
        : prefix(CLASS_NAMES.HEADER, CLASS_NAMES.HEADER_HIDDEN);

    if (selectionModel) {
        selectionModel.updateCells({
            cells: headers,
            rowId: "header",
            type: "header",
            index: 0,
            reducerKeys,
            stateKey,
            rowData: {},
            isSelected: null,
        });
    }

    columnManager.addActionColumn({
        cells: headers,
        type: "header",
        id: keyFromObject(headers),
        reducerKeys,
        stateKey,
    });

    addEmptyInsert(headers, visibleColumns, plugins);

    return (
        <thead>
            <tr className={classes}>{headers}</tr>
        </thead>
    );
};

class Header extends Component {
    render() {
        const { CLASS_NAMES } = gridConfig();
        const {
            columns,
            columnManager,
            dataSource,
            selectionModel,
            reducerKeys,
            store,
            stateKey,
            pager,
            plugins,
            visible,
        } = this.props;

        const visibleColumns = columns.filter((col) => !col.hidden);
        const headers = visibleColumns.map((col, i) => (
            <Column
                col={col}
                columnManager={columnManager}
                columns={columns}
                dataSource={dataSource}
                dragAndDropManager={dragAndDropManager}
                index={i}
                key={`header-${i}`}
                pager={pager}
                scope={this}
                store={store}
                visibleColumns={visibleColumns}
            />
        ));

        const classes = visible
            ? prefix(CLASS_NAMES.HEADER)
            : prefix(CLASS_NAMES.HEADER, CLASS_NAMES.HEADER_HIDDEN);

        if (selectionModel) {
            selectionModel.updateCells({
                cells: headers,
                rowId: "header",
                type: "header",
                index: 0,
                reducerKeys,
                stateKey,
                rowData: {},
                isSelected: null,
            });
        }

        columnManager.addActionColumn({
            cells: headers,
            type: "header",
            id: keyFromObject(headers),
            reducerKeys,
            stateKey,
        });

        addEmptyInsert(headers, visibleColumns, plugins);

        return (
            <thead>
                <tr className={classes}>{headers}</tr>
            </thead>
        );
    }

    constructor() {
        super();
        this.handleDrag = handleDrag;
        this.shouldComponentUpdate = shouldHeaderUpdate.bind(this);
    }

    static propTypes = {
        columnManager: object.isRequired,
        columns: arrayOf(object).isRequired,
        dataSource: object,
        pager: object,
        plugins: object,
        reducerKeys: oneOfType([object, string]),
        selectionModel: object,
        stateKey: string,
        store: object,
        visible: bool,
    };
}

export const addEmptyInsert = (headers, visibleColumns, plugins) => {
    if (!plugins) {
        return false;
    }

    const { GRID_ACTIONS } = plugins;

    if (visibleColumns.length === 0) {
        if (GRID_ACTIONS && GRID_ACTIONS.menu && GRID_ACTIONS.menu.length > 0) {
            headers.splice(1, 0, <EmptyHeader key="empty-header" />);
        } else {
            headers.push(<EmptyHeader key="empty-header" />);
        }
    }
};

// export default Header;
