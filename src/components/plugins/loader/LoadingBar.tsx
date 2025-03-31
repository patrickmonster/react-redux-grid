import { gridConfig } from "@/constants/GridConstants";
import { isPluginEnabled } from "@/util/isPluginEnabled";
import { prefix } from "@/util/prefix";

export type LoadingBarProps = {
    isLoading: boolean;
    plugins: object;
};

export default ({ isLoading, plugins }: LoadingBarProps) => {
    const { CLASS_NAMES } = gridConfig();

    const showLoader = isPluginEnabled(plugins, "LOADER") && isLoading;

    return (
        <div
            className={prefix(
                CLASS_NAMES.LOADING_BAR,
                showLoader ? "active" : ""
            )}
        />
    );
};
