// src/components/layout/table-row/Row.tsx

interface ColumnLenderProps {
    column: Column;
    value: any;
    row: any;
    key: string;
    index: number;
}
interface ColumnChangeProps {
    column: Column;
    value: any;
    rowId: string;
    stateKey: string;
    rowIndex: number;
}

// SORT_DIRECTIONS.ASCEND SORT_DIRECTIONS.DESCEND

export interface Column {
    name: string; // Column name
    dataIndex: string; // Data field name
    editor?: React.JSX.Element;
    width?: string | number;
    className?: string;
    hidden?: boolean;

    resizable?: boolean; // 열크기 조절 가능여부
    defaultResizable?: boolean; // 기본 열크기 조절 가능여부
    sortable?: boolean; // 정렬 가능 여부
    defaultSortDirection?: "ASC" | "DESC"; // 기본 정렬 방향
    sortDirection?: "ASC" | "DESC"; // 현재 정렬 방향
    hideable?: boolean;
    moveable?: boolean;
    createKeyFrom?: boolean; // 유니크키 여부

    placeholder?: string; // Placeholder for input
    validator?: (props: { column: Column; values: any[] }) => boolean; // Validation function

    renderer?: (props: ColumnLenderProps) => React.JSX.Element;
    change?: (props: ColumnChangeProps) => Column;
    editable?: boolean | ((props: ColumnChangeProps) => boolean);
    sortFn?: <T>(direction: "ASC" | "DESC") => (a: T, b: T) => number;
}
