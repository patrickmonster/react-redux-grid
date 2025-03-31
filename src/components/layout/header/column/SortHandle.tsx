import PropTypes from "prop-types";

import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";

export const SortHandle = ({ direction, sortHandleCls }) => (
    <span
        className={prefix(
            gridConfig().CLASS_NAMES.SORT_HANDLE,
            direction.toLowerCase(),
            sortHandleCls
        )}
    />
);

const { string } = PropTypes;

SortHandle.propTypes = {
    direction: string,
    sortHandleCls: string,
};
