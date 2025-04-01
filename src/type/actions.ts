// export const plugins = {
//     GRID_ACTIONS: {
//         iconCls: "action-icon",
//         onMenuShow: ({ columns, rowData }) => {
//             console.log("This event fires before menushow");

//             if (rowData.isDisabled) {
//                 return ["menu-item-key"]; // this field will now be disabled
//             }
//         },
//         menu: [
//             {
//                 text: "Menu Item",
//                 key: "menu-item-key",
//                 EVENT_HANDLER: () => {
//                     alert("Im a menu Item Action");
//                 },
//             },
//         ],
//     },
// };

// export const plugins = {
//     PAGER: {
//         enabled: true,
//         pagingType: "remote",
//         toolbarRenderer: (
//             pageIndex,
//             pageSize,
//             total,
//             currentRecords,
//             recordType
//         ) => {
//             return `${pageIndex * pageSize} through ${
//                 pageIndex * pageSize + currentRecords
//             } of ${total} ${recordType} Displayed`;
//         },
//         pagerComponent: false,
//     },
// };

// export const plugins = {
//     ERROR_HANDLER: {
//         defaultErrorMessage: "AN ERROR OCURRED",
//         enabled: true,
//     },
// };

// export const plugins = {
//     LOADER: {
//         enabled: true,
//     },
// };

// export const plugins = {
//     BULK_ACTIONS: {
//         enabled: true,
//         actions: [
//             {
//                 text: "Bulk Action Button",
//                 EVENT_HANDLER: () => {
//                     console.log("Doing a bulk action");
//                 },
//             },
//         ],
//     },
// };

// export const plugins = {
//     ROW: {
//         enabled: true,
//         renderer: ({ rowProps, cells, row }) => {
//             return <tr {...rowProps}>{cells}</tr>;
//         },
//     },
// };

export interface Action {
    type: string;
    payload: any;
    stateKey?: string;
}
