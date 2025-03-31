import PropTypes from "prop-types";

import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";

export const PlaceHolder = (message) => {
    const { CLASS_NAMES } = gridConfig();
    return (
        <tr className={prefix(CLASS_NAMES.ROW)}>
            <td
                className={prefix(CLASS_NAMES.ROW, CLASS_NAMES.EMPTY_ROW)}
                colSpan="100%"
            >
                {message.emptyDataMessage}
            </td>
        </tr>
    );
};

const { object } = PropTypes;

PlaceHolder.propTypes = {
    message: object,
};

PropTypes.defaultProps = {
    message: {
        emptyDataMessage: "",
    },
};
