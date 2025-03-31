import { Input } from "@/components/layout/table-row/row/cell/Input";
import { gridConfig } from "@/constants/GridConstants";
import { fireEvent } from "@/util/fire";
import { nameFromDataIndex } from "@/util/getData";
import { prefix } from "@/util/prefix";

export type EditorProps = {
    cellData: any;
    columns: any[];
    editorState: any;
    events: any;
    index: number;
    isEditable: boolean;
    isRowSelected: boolean;
    rawValue: any;
    row: object;
    rowId: string;
    stateKey: string;
    store: object;
};

export const Editor = ({
    cellData,
    columns,
    editorState,
    events,
    rawValue,
    index,
    isEditable,
    row,
    isRowSelected = false,
    rowId,
    stateKey,
    store,
}: EditorProps) => {
    const { CLASS_NAMES } = gridConfig();

    let colName =
        columns && columns[index] ? nameFromDataIndex(columns[index]) : "";

    if (!colName) {
        colName =
            columns && columns[index] && columns[index].name
                ? columns[index].name
                : "";
    }

    const editorData = editorState
        ? editorState.get(rowId) || new Map()
        : new Map();

    const invalid =
        editorData &&
        editorData.invalidCells &&
        editorData.invalidCells.contains(colName)
            ? true
            : null;

    const value =
        editorData.values && editorData.values.get
            ? editorData.values.get(colName)
            : rawValue;

    const editableFuncArgs = {
        row:
            editorData && editorData.toJS
                ? editorData.toJS()
                : editorData || {},
        isRowSelected,
        store,
    };

    const wrapperCls = prefix(
        CLASS_NAMES.EDITOR.INLINE.INPUT_WRAPPER,
        invalid ? CLASS_NAMES.EDITOR.INVALID : ""
    );

    const onFocus = () =>
        fireEvent("HANDLE_EDITOR_FOCUS", events, {
            column: columns[index],
            rowId,
            editor: editorData,
        });

    const onBlur = () =>
        fireEvent("HANDLE_EDITOR_BLUR", events, {
            column: columns[index],
            rowId,
            editor: editorData,
        });

    if (
        isEditable &&
        columns[index] &&
        columns[index].editor &&
        (columns[index].editable === undefined || columns[index].editable) &&
        (typeof columns[index].editable === "function"
            ? columns[index].editable(editableFuncArgs)
            : true) &&
        typeof columns[index].editor === "function"
    ) {
        const input = columns[index].editor({
            column: columns[index],
            columns,
            store,
            rowId,
            onFocus,
            onBlur,
            row:
                editorData && editorData.values && editorData.toJS
                    ? { ...row, ...cleanProps(editorData.values.toJS()) }
                    : { key: rowId, ...row },
            columnIndex: index,
            value: value && value.toJS ? value.toJS() : value,
            isRowSelected,
            stateKey,
            isCreate: editorData.isCreate,
        });

        return <span className={wrapperCls}>{input}</span>;
    } else if (
        isEditable &&
        columns[index] &&
        (columns[index].editable === undefined || columns[index].editable) &&
        (typeof columns[index].editable === "function"
            ? columns[index].editable(editableFuncArgs)
            : true)
    ) {
        return (
            <span className={wrapperCls}>
                <Input
                    cellData={value}
                    column={columns[index]}
                    columns={columns}
                    editorState={editorState}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    rowId={rowId}
                    stateKey={stateKey}
                    store={store}
                />
            </span>
        );
    }

    return (
        <span className={prefix(CLASS_NAMES.INACTIVE_CLASS)}>{cellData}</span>
    );
};

export const cleanProps = (obj: { [key: string]: any }) => {
    Object.keys(obj || {}).forEach(
        (k) => obj[k] === undefined && delete obj[k]
    );
    return obj;
};
