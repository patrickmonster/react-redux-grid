import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";

export type PlaceHolderProps = {
    emptyDataMessage: string;
};

export const PlaceHolder = ({ emptyDataMessage }: PlaceHolderProps) => {
    const { CLASS_NAMES } = gridConfig();

    return (
        <tr className={prefix(CLASS_NAMES.ROW)}>
            <td
                className={prefix(CLASS_NAMES.ROW, CLASS_NAMES.EMPTY_ROW)}
                // colSpan="100%"
            >
                {emptyDataMessage}
            </td>
        </tr>
    );
};
