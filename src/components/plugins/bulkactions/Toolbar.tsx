import { gridConfig } from "@/constants/GridConstants";
import { isPluginEnabled } from "@/util/isPluginEnabled";
import { keyFromObject } from "@/util/keyGenerator";
import { prefix } from "@/util/prefix";
import { stateGetter } from "@/util/stateGetter";
import { useEffect, useRef } from "react";
// import { connect } from "react-redux";

export type BulkActionToolbarPrpops = {
    bulkActionState: object;
    dataSource: object;
    plugins: object;
    selectedRows: object;
    selectionModel: object;
    stateKey: string;
    store: object;
};

export default (props: BulkActionToolbarPrpops) => {
    const { bulkActionState, selectedRows, plugins } = props;
    const timeOut = useRef<NodeJS.Timer>();
    const { CLASS_NAMES } = gridConfig();

    const handleChange = (reactEvent) => {
        const { stateKey, store, dataSource } = this.props;

        if (reactEvent.target && reactEvent.target.checked) {
            store.dispatch(selectAll({ data: dataSource, stateKey }));
        } else {
            store.dispatch(deselectAll({ stateKey }));
        }
    };
    const getTotalSelection = (selectedRows) =>
        selectedRows && Object.keys(selectedRows).length
            ? Object.keys(selectedRows).filter(
                  (k) =>
                      selectedRows[k] && k !== "lastUpdate" && k !== "indexes"
              ).length
            : 0;

    useEffect(() => {
        const { store, stateKey, bulkActionState, selectedRows } = this.props;
        const isRemoved = bulkActionState && bulkActionState.isRemoved;
        const totalCount = getTotalSelection(selectedRows);

        if (bulkActionState) {
            if (totalCount === 0 && !isRemoved) {
                timeOut.current && clearTimeout(timeOut.current);
                timeOut.current = setTimeout(() => {
                    store.dispatch(removeToolbar({ state: true, stateKey }));
                }, 300);
            } else if (totalCount > 0 && isRemoved) {
                store.dispatch(removeToolbar({ state: false, stateKey }));
            }
        }
    }, []);
    const totalCount = getTotalSelection(selectedRows);

    return isPluginEnabled(plugins, "BULK_ACTIONS") &&
        plugins.BULK_ACTIONS.actions &&
        plugins.BULK_ACTIONS.actions.length > 0 ? (
        <div
            className={prefix(
                CLASS_NAMES.BULK_ACTIONS.CONTAINER,
                totalCount > 0
                    ? CLASS_NAMES.BULK_ACTIONS.SHOWN
                    : CLASS_NAMES.BULK_ACTIONS.HIDDEN, // shownCls
                bulkActionState && bulkActionState.isRemoved ? "removed" : null // removedCls
            )}
        >
            <span
                className={prefix(CLASS_NAMES.BULK_ACTIONS.DESCRIPTION)}
                children={`${totalCount} Selected`}
            />
            {plugins.BULK_ACTIONS.actions.map((action) => (
                <button
                    onClick={action.EVENT_HANDLER}
                    key={keyFromObject(action)}
                >
                    {action.text}
                </button>
            ))}
        </div>
    ) : (
        <div />
    );
};

function mapStateToProps(state, props) {
    return {
        dataSource: stateGetter(state, props, "dataSource", props.stateKey),
        selectedRows: stateGetter(state, props, "selection", props.stateKey),
        bulkActionState: stateGetter(
            state,
            props,
            "bulkaction",
            props.stateKey
        ),
    };
}

// connect(mapStateToProps)(BulkActionToolbar);
