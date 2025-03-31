import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";

export default () => {
    const { CLASS_NAMES } = gridConfig();
    return <span className={prefix(CLASS_NAMES.ROW_DRAG_HANDLE)} />;
};
