import { updateCellValue } from "@/actions/plugins/editor/EditorActions";
import { Editor } from "@/records";
import { nameFromDataIndex } from "@/util/getData";

export type InputProps = {
    cellData: any;
    column: object;
    columns: any[];
    editorState: any;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    rowId: string;
    stateKey: string;
    store: object;
};

export const Input = ({
    cellData,
    column,
    columns,
    editorState,
    onBlur,
    onFocus,
    rowId,
    stateKey,
    store,
}: InputProps) => {
    const colName = nameFromDataIndex(column);
    const editorData =
        editorState && editorState.get ? editorState.get(rowId) : new Editor();

    const overrides =
        editorData &&
        editorData.values &&
        editorData.overrides[colName] !== undefined
            ? editorData.overrides[colName]
            : {};

    const placeholder =
        column && column.placeholder ? column.placeholder : null;

    const value =
        editorData &&
        editorData.values &&
        editorData.values[colName] !== undefined
            ? editorData.values[colName]
            : cellData;

    const disabled =
        overrides.disabled ||
        (editorState &&
            editorData &&
            !editorData.isCreate &&
            column.editable === "create");

    const onChange = (e) =>
        handleChange(column, columns, rowId, stateKey, store, e);

    return (
        <input
            disabled={disabled}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            type="text"
            value={value}
        />
    );
};

export const handleChange = (
    columnDefinition: object,
    columns: any[],
    rowId: string,
    stateKey: string,
    store: object,
    reactEvent: React.ChangeEvent<HTMLInputElement>
) => {
    store.dispatch(
        updateCellValue({
            value: reactEvent.target.value,
            name: nameFromDataIndex(columnDefinition),
            column: columnDefinition,
            rowId,
            columns,
            stateKey,
        })
    );
};
