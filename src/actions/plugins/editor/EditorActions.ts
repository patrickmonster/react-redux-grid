import {
    ADD_NEW_ROW,
    CANCEL_ROW,
    DISMISS_EDITOR,
    EDIT_ROW,
    EDITOR_VALIDATION,
    REMOVE_ROW,
    REPOSITION_EDITOR,
    ROW_VALUE_CHANGE,
    SAVE_ROW,
    UPDATE_ROW,
} from "@/constants/ActionTypes";

import { getNewRowId } from "@/util/getNewRowId";
import { keyGenerator } from "@/util/keyGenerator";

type RowId = string | number;
type RowIndex = number;

export const editRow = (data: {
    rowId: RowId;
    top: number;
    rowData: any;
    rowIndex: number;
    columns: any;
    isCreate: boolean;
    stateKey: string;
    editMode: string;
}) => {
    if (!data.rowId) {
        throw new Error("rowId is a required parameter for editRow Action");
    }

    return {
        type: EDIT_ROW,
        ...data,
        rowData: null,
        editMode: data.editMode || "inline",
    };
};

export const repositionEditor = (data: {
    top: number;
    stateKey: string;
    rowId: RowId;
}) => ({
    ...data,
    type: REPOSITION_EDITOR,
});

export const dismissEditor = ({ stateKey }: { stateKey: string }) => ({
    type: DISMISS_EDITOR,
    stateKey,
});

export const updateCellValue = (data: {
    value: any;
    name: string;
    column: any;
    columns: any;
    stateKey: string;
    rowId: RowId;
}) => ({
    ...data,
    name: null,
    columnName: data.name,
    type: ROW_VALUE_CHANGE,
});

export const saveRow = (data: {
    values: any;
    rowIndex: RowIndex;
    stateKey: string;
}) => ({
    type: SAVE_ROW,
    ...data,
});

export const cancelRow = ({ stateKey }: { stateKey: string }) => ({
    type: CANCEL_ROW,
    stateKey,
});

export const removeRow = (
    data:
        | {
              rowIndex: RowIndex;
              stateKey: string;
          }
        | { rowId: RowId; stateKey: string }
) => ({
    type: REMOVE_ROW,
    ...data,
});

export const setEditorValidation = (data: {
    validationState: string;
    stateKey: string;
}) => ({
    type: EDITOR_VALIDATION,
    ...data,
});

export const updateRow = (data: {
    stateKey: string;
    rowIndex: RowIndex;
    values: any;
}) => ({
    ...data,
    type: UPDATE_ROW,
});

export const addNewRow =
    (data: {
        columns: any;
        data: any;
        stateKey: string;
        editMode: string;
        rowIndex: RowIndex;
        isCreate: boolean;
    }) =>
    // TODO :   edit dispatch to use the newRowId
    (dispatch: any) => {
        const rowId = keyGenerator("row", `${getNewRowId()}`);
        const top = 43;
        const rowData = data.data || {};

        dispatch({
            type: ADD_NEW_ROW,
            stateKey: data.stateKey,
            rowId,
            rowIndex: data.rowIndex,
        });

        dispatch(
            editRow({
                rowId,
                top,
                rowData,
                ...data,
            })
        );
    };
