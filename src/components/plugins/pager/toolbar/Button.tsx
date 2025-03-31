import { gridConfig } from "@/constants/GridConstants";
import { prefix } from "@/util/prefix";

import {
    setPage,
    setPageAsync,
    setPageIndexAsync,
} from "@/actions/plugins/pager/PagerActions";

export type ButtonProps = {
    BUTTON_TYPES?: {
        NEXT: string;
        BACK: string;
    };
    backButtonText?: string;
    currentRecords: number;
    dataSource: any;
    nextButtonText?: string;
    pageIndex: number;
    pageSize: number;
    plugins: any;
    stateKey: string;
    store: any;
    total: number;
    type: string;
};

export const Button = ({
    BUTTON_TYPES = {
        NEXT: "NEXT",
        BACK: "BACK",
    },
    backButtonText = "Back",
    currentRecords,
    dataSource,
    nextButtonText = "Next",
    pageIndex,
    pageSize,
    plugins,
    stateKey,
    store,
    total,
    type,
}: ButtonProps) => {
    const { CLASS_NAMES } = gridConfig();

    const isButtonDisabled = (
        type: string,
        pageIndex: number,
        pageSize: number,
        currentRecords: number,
        total: number,
        BUTTON_TYPES: any
    ) => {
        if (type === BUTTON_TYPES.BACK) {
            return pageIndex === 0;
        } else if (type === BUTTON_TYPES.NEXT) {
            return (
                (currentRecords < pageSize && total < currentRecords) ||
                pageIndex * pageSize + currentRecords === total
            );
        }
    };

    const buttonProps = {
        onClick: handleButtonClick.bind(
            this,
            type,
            pageIndex,
            pageSize,
            dataSource,
            BUTTON_TYPES,
            plugins,
            stateKey,
            store
        ),
        children: type === BUTTON_TYPES.NEXT ? nextButtonText : backButtonText,
        disabled: isButtonDisabled(
            type,
            pageIndex,
            pageSize,
            currentRecords,
            total,
            BUTTON_TYPES
        ),
        className: prefix(CLASS_NAMES.BUTTONS.PAGER, type.toLowerCase()),
    };

    return <button {...buttonProps} />;
};

export const handleButtonClick = (
    type: string,
    pageIndex: number,
    pageSize: number,
    dataSource: any,
    BUTTON_TYPES: any,
    plugins: any,
    stateKey: string,
    store: any
) => {
    const PAGER = plugins.PAGER;

    if (PAGER.pagingType === "local") {
        store.dispatch(
            setPage({
                index: pageIndex,
                type,
                BUTTON_TYPES,
                // stateKey
            })
        );
    } else if (PAGER.pagingType === "remote" && dataSource) {
        if (typeof dataSource === "string") {
            return store.dispatch(
                setPageAsync({
                    index: pageIndex,
                    pageSize,
                    type,
                    BUTTON_TYPES,
                    dataSource,
                    stateKey,
                })
            );
        }

        const nextIndex =
            type === BUTTON_TYPES.NEXT ? pageIndex + 1 : pageIndex - 1 || 0;

        return store.dispatch(
            setPageIndexAsync({
                pageIndex: nextIndex,
                pageSize,
                type,
                BUTTON_TYPES,
                dataSource,
                stateKey,
            })
        );
    } else {
        /* eslint-disable no-console */
        console.warn(
            [
                "Please configure paging plugin pagingType",
                "to local if no pagingSource is provided",
            ].join(" ")
        );
    }
};
