import * as BulkActions from "@/actions/plugins/bulkactions/ToolbarActions";

import * as ColumnManagerActions from "@/actions/core/ColumnManager";

import * as EditorActions from "@/actions/plugins/editor/EditorActions";

import * as ErrorHandlerActions from "@/actions/plugins/errorhandler/ErrorHandlerActions"; // eslint-disable-line

import * as GridActions from "@/actions/GridActions";

import * as LoaderActions from "@/actions/plugins/loader/LoaderActions";

import * as MenuActions from "@/actions/plugins/actioncolumn/MenuActions";

import * as PagerActions from "@/actions/plugins/pager/PagerActions";

import * as SelectionActions from "@/actions/plugins/selection/ModelActions";

export const Actions = {
    BulkActions,
    ColumnManagerActions,
    EditorActions,
    ErrorHandlerActions,
    GridActions,
    LoaderActions,
    MenuActions,
    PagerActions,
    SelectionActions,
};

export default Actions;
