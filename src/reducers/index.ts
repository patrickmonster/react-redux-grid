import dataSource from "@/reducers/components/datasource";
import grid from "@/reducers/components/grid";
import bulkaction from "@/reducers/components/plugins/bulkaction";
import editor from "@/reducers/components/plugins/editor";
import errorhandler from "@/reducers/components/plugins/errorhandler";
import loader from "@/reducers/components/plugins/loader";
import menu from "@/reducers/components/plugins/menu";
import pager from "@/reducers/components/plugins/pager";
import selection from "@/reducers/components/plugins/selection";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
    bulkAction: bulkaction,
    dataSource,
    editor,
    errorHandler: errorhandler,
    grid,
    menu,
    pager,
    loader,
    selection,
});

export const Reducers = {
    bulkAction: bulkaction,
    dataSource,
    editor,
    errorHandler: errorhandler,
    grid,
    loader,
    menu,
    pager,
    selection,
};

export default rootReducer;
