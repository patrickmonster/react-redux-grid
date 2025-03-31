import { OrderedMap } from "immutable";

import {
    HIDE_HEADER,
    RESIZE_COLUMNS,
    SET_COLUMNS,
    SET_SORT_DIRECTION,
} from "@/constants/ActionTypes";

import handleActions from "@/util/handleActions";

import {
    hideHeader,
    resizeColumns,
    setColumns,
    setSortDirection,
} from "@/reducers/actionHelpers/grid";

const initialState = new OrderedMap();

export default handleActions(
    {
        [SET_COLUMNS]: setColumns,
        [RESIZE_COLUMNS]: resizeColumns,
        [SET_SORT_DIRECTION]: setSortDirection,
        [HIDE_HEADER]: hideHeader,
    },
    initialState
);
