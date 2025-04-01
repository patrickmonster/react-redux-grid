// stateful	bool	the grid will store column configuration in browser local storage (based off of stateKey, so the key must be unique across all grids in a single application)
// height	oneOfType([number, string, bool])	the height of the grid container, if false, then no height will be set
// stateKey	string	unique id for grid, more information available
// showTreeRootNode	bool	used with tree-grid, to determine if root node should be displayed
// classNames	array	a list of strings to be applied to the grid container as classes
// events	object	grid event object, more information below
// reducerKeys	object	object describing custom named reducers, more information below
// pageSize	int	number of records to shown on a single grid page
// emptyDataMessage	any	can be a string or a react component, which will be displayed if no grid data is available
// dragAndDrop	bool	whether drag and drop of rows should be enabled
// gridType	oneOf(['grid', 'tree'])	whether the grid will be a flat list or a tree view
// data	arrayOf(object)	local data for grid to display, more information available
// dataSource	func	function which returns data to display, more information available
// filterFields	object	optional object describing additional values to filter grid data
export type GridType = "grid" | "tree";

//
export type PluginType = {
    COLUMN_MANAGER: any;
    ROW: any;
    GRID_ACTIONS: any;
    STICKY_HEADER: any;
    PAGER: any;
    BULK_ACTIONS: any;
    EDITOR: any;
    ERROR_HANDLER: any;
    STICKY_FOOTER: any;
    SELECTION_MODEL: any;
};

export interface GridProps {
    stateful?: boolean;
    height?: number | string | boolean;
    stateKey?: string;
    showTreeRootNode?: boolean;
    className?: string;
    events?: object;
    reducerKeys?: object;
    pageSize?: number;
    emptyDataMessage?: any;
    dragAndDrop?: boolean;
    gridType?: GridType;
    data?: Array<object>;
    filterFields?: object;
}
