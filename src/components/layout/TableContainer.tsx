import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";

import { gridConfig } from "@/constants/GridConstants.js";
import { prefix } from "@/util/prefix.js";
import { debounce, throttle } from "@/util/throttle.js";
import Header from "./Header";
import Row from "./TableRow.js";

const { any, bool, number, object, oneOfType, string } = PropTypes;

export type TableContainerProps = {
    editorComponent: any;
    headerProps: object;
    height: false | string | number;
    infinite: boolean;
    rowProps: object;
};

/**
 * TableContainer
 */
export default (props: TableContainerProps) => {
    const { CLASS_NAMES } = gridConfig();
    const { editorComponent, headerProps, height, rowProps, infinite } = props;
    const [containerScrollTop, setContainerScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const container = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(
        () =>
            container.current &&
            setContainerScrollTop(container.current.scrollTop),
        []
    );

    const handleResize = useCallback(() => {
        const { infinite } = props;

        if (infinite) {
            if (
                container.current &&
                containerHeight !== container.current?.clientHeight
            )
                setContainerHeight(container.current?.clientHeight);
        }
    }, []);

    const _resizeListener = useCallback(debounce(handleResize, 5), []);

    const _scrollListener = useCallback(
        () =>
            throttle(handleScroll, this, 50, {
                leading: false,
                trailing: true,
            }),
        []
    );

    ////////////////////////////////////////////////////////////////////////////////////

    useEffect(handleResize, [props]);
    useEffect(() => {
        if (props.infinite) {
            container.current?.addEventListener("scroll", _scrollListener);
            window.addEventListener("resize", _resizeListener);
            handleResize();
        }

        return () => {
            if (props.infinite) {
                container.current?.removeEventListener(
                    "scroll",
                    _scrollListener
                );
                window.removeEventListener("resize", _resizeListener);
            }
        };
    }, []);

    ////////////////////////////////////////////////////////////////////////////////////

    return (
        <div
            className={prefix(CLASS_NAMES.TABLE_CONTAINER)}
            style={{ height: height !== false ? height : "auto" }}
            ref={container}
        >
            <table
                cellSpacing={0}
                className={prefix(CLASS_NAMES.TABLE, CLASS_NAMES.HEADER_HIDDEN)}
            >
                <Header {...headerProps} />
                <Row
                    containerHeight={containerHeight}
                    containerScrollTop={containerScrollTop}
                    infinite={infinite}
                    {...rowProps}
                />
            </table>
            {editorComponent}
        </div>
    );
};
