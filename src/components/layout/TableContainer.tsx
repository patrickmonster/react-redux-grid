import PropTypes from "prop-types";
import { Component } from "react";
import ReactDOM from "react-dom";

import { gridConfig } from "../../constants/GridConstants.js";
import { prefix } from "../../util/prefix.js";
import { debounce, throttle } from "../../util/throttle.js";
import Header from "./Header";
import Row from "./TableRow";

const { any, bool, number, object, oneOfType, string } = PropTypes;

export type TableContainerProps = {
    editorComponent: any;
    headerProps: object;
    height: boolean | string | number;
    infinite: boolean;
    rowProps: object;
};


constructor(props) {
    super(props);

    this.state = {
        containerScrollTop: 0,
    };
}

static propTypes = {
    editorComponent: any,
    headerProps: object,
    height: oneOfType([bool, string, number]),
    infinite: bool,
    rowProps: object,
};

static defaultProps = {
    headerProps: {},
    rowProps: {},
};
/**
 * TableContainer
 */
export default (props: TableContainerProps) => {
    const { CLASS_NAMES } = gridConfig();
    const { editorComponent, headerProps, height, rowProps, infinite } = props;
    const [containerScrollTop, setContainerScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    return (
        <div
            className={prefix(CLASS_NAMES.TABLE_CONTAINER)}
            style={{ height: height !== false ? height : null }}
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

export class TableContainer extends Component {
    render() {}

    componentDidMount() {
        const { infinite } = this.props;

        if (infinite) {
            const container = ReactDOM.findDOMNode(this);

            this._scrollListener = throttle(
                this.handleScroll.bind(this),
                this,
                50,
                { leading: false, trailing: true }
            );

            container.addEventListener("scroll", this._scrollListener);

            this._resizeListener = debounce(this.handleResize.bind(this), 5);

            window.addEventListener("resize", this._resizeListener);

            this.handleResize();
        }
    }
    componentDidUpdate() {
        this.handleResize();
    }

    componentWillUnmount() {
        const container = ReactDOM.findDOMNode(this);

        container.removeEventListener("scroll", this._scrollListener);
        window.removeEventListener("resize", this._resizeListener);
    }

    constructor(props) {
        super(props);

        this.state = {
            containerScrollTop: 0,
        };
    }

    static propTypes = {
        editorComponent: any,
        headerProps: object,
        height: oneOfType([bool, string, number]),
        infinite: bool,
        rowProps: object,
    };

    static defaultProps = {
        headerProps: {},
        rowProps: {},
    };

    handleResize = () => {
        const { infinite } = this.props;
        const { containerHeight } = this.state;

        if (infinite) {
            const container = ReactDOM.findDOMNode(this);

            if (containerHeight !== container.clientHeight) {
                this.setState({
                    containerHeight: container.clientHeight,
                });
            }
        }
    };

    handleScroll = () => {
        const container = ReactDOM.findDOMNode(this);

        this.setState({
            containerScrollTop: container.scrollTop,
        });
    };
}
