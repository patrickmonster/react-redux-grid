import { setTreeNodeVisibility } from "@/actions/GridActions";
import localStorageManager from "@/components/core/LocalStorageManager";
import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";

const debouncedSetStateItem = localStorageManager.debouncedSetStateItem();

export type TreeArrowProps = {
    depth?: number;
    gridType?: "grid" | "tree";
    hasChildren?: boolean;
    id?: any;
    isEditable?: boolean;
    isExpandable?: boolean;
    isExpanded?: boolean;
    readFunc?: (args: { parentId: string }) => void;
    shouldNest?: boolean;
    showTreeRootNode?: boolean;
    stateKey?: string;
    stateful?: boolean;
    store?: object;
};

export default ({
    depth,
    hasChildren,
    id,
    isEditable,
    isExpandable,
    isExpanded,
    readFunc,
    showTreeRootNode,
    shouldNest,
    stateful,
    stateKey,
    store,
}: TreeArrowProps) => {
    const { CLASS_NAMES } = gridConfig();
    const className = getClassName({
        CLASS_NAMES,
        isEditable,
        isExpandable,
        shouldNest,
        isExpanded,
        depth,
    });
    const onClick = handleArrowClick.bind(null, {
        hasChildren,
        id,
        isExpanded,
        readFunc,
        showTreeRootNode,
        stateKey,
        stateful,
        store,
    });

    return <span className={className} onClick={onClick} />;
};

export const getClassName = ({
    CLASS_NAMES,
    isEditable,
    isExpandable,
    shouldNest,
    isExpanded,
    depth,
}: {
    CLASS_NAMES: any;
    isEditable?: boolean;
    isExpandable?: boolean;
    shouldNest?: boolean;
    isExpanded?: boolean;
    depth?: number;
}) =>
    prefix(
        CLASS_NAMES.CELL_TREE_ARROW,
        isEditable ? "edit" : "",
        isExpandable ? "expand" : "",
        shouldNest ? "tree-nested" : "",
        depth !== undefined ? `tree-node-depth-${depth}` : "",
        isExpanded ? "node-expanded" : "node-unexpanded"
    );

export const handleArrowClick = (
    {
        hasChildren,
        id,
        isExpanded,
        readFunc,
        showTreeRootNode,
        stateKey,
        stateful,
        store,
    }: {
        hasChildren: boolean;
        id: any;
        isExpanded: boolean;
        readFunc: (args: { parentId: string }) => void;
        showTreeRootNode?: boolean;
        stateKey?: string;
        stateful?: boolean;
        store?: any;
    },
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> // eslint-disable-line
) => {
    e.stopPropagation();

    if (!hasChildren) {
        readFunc({
            parentId: id,
        });
    } else {
        store.dispatch(
            setTreeNodeVisibility({
                stateKey,
                id,
                showTreeRootNode,
            })
        );
    }

    if (stateful) {
        // if stateful
        // save which node ids have been expanded
        const expandedColumns =
            localStorageManager.getStateItem({
                stateKey,
                property: "expandedNodes",
                shouldSave: false,
            }) || {};

        expandedColumns[id] = !isExpanded;

        debouncedSetStateItem({
            stateKey,
            property: "expandedNodes",
            value: expandedColumns,
        });
    }
};
