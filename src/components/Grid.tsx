import deepEqual from "deep-equal";
import {
    Component,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { connect } from "react-redux";

import FixedHeader from "@/components/layout/FixedHeader";
import TableContainer from "@/components/layout/TableContainer";
import BulkActionToolbar from "@/components/plugins/bulkactions/Toolbar";
import Message from "@/components/plugins/errorhandler/Message";
import LoadingBar from "@/components/plugins/loader/LoadingBar";
import PagerToolbar from "@/components/plugins/pager/Pager";
import { prefix } from "@/util/prefix";

import { CLASS_NAMES, GRID_TYPES } from "@/constants/GridConstants";

import * as Action from "@/actions/GridActions";
import localStorageManager from "@/components/core/LocalStorageManager";
import { getColumnsFromStorage } from "@/util/getColumnsFromStorage";
import { mapStateToProps } from "@/util/mapStateToProps";

import styles from "@/style/main.styl";
import { isPluginEnabled } from "@/util/isPluginEnabled";

export type GridProps = {
    columnState?: {
        headerHidden?: boolean;
        columns?: object[];
        [key: string]: any;
    };
    columns: object[];
    data?: object[] | object;
    dataSource?: any;
    dragAndDrop?: boolean;
    editorState?: object;
    emptyDataMessage?: any;
    events?: object;
    expandOnLoad?: boolean;
    filterFields?: object;
    gridData?: object;
    gridType: GRID_TYPES;
    height: string | number | boolean;
    infinite?: boolean;
    // loadingState?: boolean; // fix object -> boolean
    isLoading?: boolean;
    menuState?: object;
    pageSize: number;
    pager: object;
    plugins: object;
    reducerKeys: object | string;
    selectedRows: object;
    showTreeRootNode?: boolean;
    stateKey: string;
    stateful?: boolean;
    store: object;
} & React.HTMLProps<HTMLDivElement>;

const GridContext = createContext<{
    store: any;
}>({
    store: null,
});

export const Grid = (props: GridProps) => {
    const {
        className,
        columnState,
        dataSource,
        gridData,
        height,
        infinite,
        pager,
        pageSize,
        plugins,
        reducerKeys,
        stateKey,
        data,
        expandOnLoad,
        showTreeRootNode,
        isLoading,
    } = props;

    const gridType = props.gridType || "grid";
    const headerHidden = columnState ? columnState.headerHidden : false;
    const [_USING_DATA_ARRAY, setGridDataType] = useState(false);

    const getColumns = () => {
        const { columns, columnState } = props;

        return columnState && columnState.get && columnState.get("columns")
            ? columnState.get("columns")
            : columns;
    };

    const getStore = () => {
        const { store } = useContext(GridContext);
        return store || props.store;
    };

    const getHeaderProps = (visible) => ({
        columnManager: this.columnManager,
        columns: this.getColumns(),
        plugins: this.props.plugins,
        reducerKeys: this.props.reducerKeys,
        dataSource: this.props.gridData,
        filterFields: this.props.filterFields,
        pager: this.props.pager,
        pageSize: this.props.pageSize,
        selectionModel: this.selectionModel,
        stateKey: this.props.stateKey,
        store: this.getStore(),
        stateful: this.props.stateful,
        visible,
        menuState: this.props.menuState,
        gridType: this.gridType,
    });

    const setColumns = (props?: { stateKey: string; stateful: boolean }) => {
        const { stateKey, stateful } = props || {};
        const store = getStore();
        const columns = getColumns();

        const savedColumns = stateful
            ? getColumnsFromStorage(
                  localStorageManager.getStateItem({
                      stateKey,
                      value: columns,
                      property: "columns",
                  }),
                  columns
              )
            : columns;

        if (!columns || columns.length === 0 || !Array.isArray(columns)) {
            throw new Error("A columns array is required");
        } else {
            store.dispatch(
                Action.setColumns({ columns: savedColumns, stateKey, stateful })
            );
        }
    };

    const setData = (extraParams = {}) => {
        const store = this.getStore();

        const editMode = isPluginEnabled(plugins, "EDITOR")
            ? plugins.EDITOR.type
            : null;

        const isDataSourceString =
            typeof dataSource === "string" || typeof dataSource === "function";

        switch (gridType) {
            case "tree":
                if (isDataSourceString) {
                    setGridDataType(false);
                    store.dispatch(
                        Action.getAsyncData({
                            stateKey,
                            dataSource,
                            type: "tree",
                            showTreeRootNode,
                            extraParams: {
                                ...extraParams,
                                expandOnLoad,
                                editMode,
                            },
                        })
                    );
                } else {
                    setGridDataType(true);
                    store.dispatch(
                        Action.setTreeData({
                            stateKey,
                            data,
                            showTreeRootNode,
                            extraParams: {
                                ...extraParams,
                                expandOnLoad,
                                editMode,
                            },
                        })
                    );
                }
                break;
            case "grid":
                if (isDataSourceString) {
                    setGridDataType(false);
                    store.dispatch(
                        Action.getAsyncData({
                            stateKey,
                            dataSource,
                            extraParams: { ...extraParams, editMode },
                        })
                    );
                } else if (data) {
                    setGridDataType(true);
                    store.dispatch(
                        Action.setData({ stateKey, data, editMode })
                    );
                } else {
                    throw new Error(
                        "A data source, or a static data set is required"
                    );
                }
                break;
            default:
                throw new Error(`Grid type "${gridType}" is not supported`);
        }
    };

    // constructor(props) {
    //     super(props);
    //     this.shouldComponentUpdate = shouldGridUpdate.bind(this);
    //     this.columnManager = new ColumnManager();
    //     this.editor = new Manager();
    //     this.selectionModel = new Model();
    // }
    //////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const store = getStore();
        const columns = getColumns();

        if (!stateKey)
            throw new Error("A stateKey is required to initialize the grid");

        setColumns();

        this.setData();

        columnManager.init({
            plugins,
            store,
            events,
            selectionModel: this.selectionModel,
            editor: this.editor,
            columns,
            dataSource,
            reducerKeys,
        });

        selectionModel.init(plugins, stateKey, store, events);

        editor.init(plugins, stateKey, store, events);
    }, []);
    //////////////////////////////////////////////////////////////////////

    return (
        <div
            className={prefix(
                CLASS_NAMES.CONTAINER,
                isLoading ? CLASS_NAMES.IS_LOADING : null,
                className || ""
            )}
        >
            <Message
                reducerKeys={reducerKeys}
                stateKey={stateKey}
                store={store}
                plugins={plugins}
            />
            <BulkActionToolbar
                plugins={plugins}
                reducerKeys={reducerKeys}
                selectionModel={this.selectionModel}
                stateKey={stateKey}
                store={store}
            />
            <FixedHeader
                headerHidden={headerHidden}
                {...getHeaderProps(true)}
            />
            <TableContainer
                editorComponent={editorComponent}
                headerProps={getHeaderProps(false)}
                height={height}
                infinite={infinite}
                rowProps={this.getRowProps()}
            />
            <PagerToolbar
                dataSource={dataSource}
                gridData={gridData}
                pageSize={pageSize}
                pagerState={pager}
                plugins={plugins}
                reducerKeys={reducerKeys}
                stateKey={stateKey}
                store={store}
            />
            <LoadingBar isLoading={isLoading} plugins={plugins} />
        </div>
    );
};

export class GridT extends Component {
    componentWillMount() {
        const { dataSource, gridType, events, plugins, reducerKeys, stateKey } =
            this.props;

        const columns = this.getColumns();
        const store = this.getStore();

        this.gridType = gridType === "tree" ? "tree" : "grid";

        if (!stateKey) {
            throw new Error("A stateKey is required to intialize the grid");
        }

        this.setColumns();

        this.setData();

        this.columnManager.init({
            plugins,
            store,
            events,
            selectionModel: this.selectionModel,
            editor: this.editor,
            columns,
            dataSource,
            reducerKeys,
        });

        this.selectionModel.init(plugins, stateKey, store, events);

        this.editor.init(plugins, stateKey, store, events);
    }

    componentWillReceiveProps(nextProps) {
        // for issue #30 -- if we're relying on a dataArray
        // as the dataSource, we need to trigger rerender
        // if the dataArray has changed

        if (this._USING_DATA_ARRAY) {
            // check to see if new data, is the same as old data
            // -- without _key property
            const shouldResetData =
                this.gridType === "tree"
                    ? !deepEqual(this.props.data, nextProps.data)
                    : !deepEqual(
                          this.props.data.map(this.removeKeys),
                          nextProps.data.map(this.removeKeys)
                      );

            // sigh, this is a hack
            // if we do need to retrigger, we cant do
            // that within `componentWillReceiveProps`
            // instead, we need to pull the call of the call frame
            // we do this instead of applying logic inside of componentDidUpdate
            // since this is potentially a very expensive operation
            // and only want to rerun when props have actually changed
            if (shouldResetData) {
                setTimeout(this.setData.bind(this), 0);
            }
        }
    }

    static contextTypes = {
        store: object,
    };

    static propTypes = {
        classNames: array,
        columnState: object,
        columns: arrayOf(object).isRequired,
        data: oneOfType([arrayOf(object), object]),
        dataSource: any,
        dragAndDrop: bool,
        editorState: object,
        emptyDataMessage: any,
        events: object,
        expandOnLoad: bool,
        filterFields: object,
        gridData: object,
        gridType: GRID_TYPES,
        height: oneOfType([bool, string, number]),
        infinite: bool,
        loadingState: object,
        menuState: object,
        pageSize: number,
        pager: object,
        plugins: object,
        reducerKeys: oneOfType([object, string]),
        selectedRows: object,
        showTreeRootNode: bool,
        stateKey: string,
        stateful: bool,
        store: object,
    };

    static defaultProps = {
        classNames: [],
        columnState: {},
        columns: [],
        events: {},
        filterFields: {},
        height: "500px",
        pageSize: 25,
        reducerKeys: {},
        showTreeRootNode: false,
    };

    static CSS_LOADED = false;

    removeKeys = (item) => ({
        ...item,
        _key: undefined,
    });

    getRowProps = () => ({
        columnManager: this.columnManager,
        columns: this.getColumns(),
        dragAndDrop: this.props.dragAndDrop,
        editor: this.editor,
        emptyDataMessage: this.props.emptyDataMessage,
        dataSource: this.props.gridData,
        readFunc: this.setData.bind(this),
        pager: this.props.pager,
        editorState: this.props.editorState,
        selectedRows: this.props.selectedRows,
        events: this.props.events,
        pageSize: this.props.pageSize,
        plugins: this.props.plugins,
        reducerKeys: this.props.reducerKeys,
        selectionModel: this.selectionModel,
        stateKey: this.props.stateKey,
        store: this.getStore(),
        stateful: this.props.stateful,
        showTreeRootNode: this.props.showTreeRootNode,
        menuState: this.props.menuState,
        gridType: this.gridType,
    });

    getEditor = () =>
        this.editor.getComponent(
            this.props.plugins,
            this.props.reducerKeys,
            this.getStore(),
            this.props.events,
            this.selectionModel,
            this.editor,
            this.props.columns
        );

    getColumns = () => {
        const { columns, columnState } = this.props;

        if (columnState && columnState.get && columnState.get("columns")) {
            return columnState.get("columns");
        }

        return columns;
    };
    addStyles = () => {
        const styleEl = document.createElement("style");
        const head = document.head || document.getElementsByTagName("head")[0];

        styleEl.type = "text/css";

        if (styleEl.styleSheet) {
            styleEl.styleSheet.cssText = styles;
        } else {
            styleEl.appendChild(document.createTextNode(styles));
        }

        head.appendChild(styleEl);
    };
}

export default connect(mapStateToProps)(Grid);
