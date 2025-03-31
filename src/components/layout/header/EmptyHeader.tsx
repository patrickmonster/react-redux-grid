import React from "react";

export default (props: any) => {
    const headerProps = {
        style: {
            width: "100%",
        },
        key: "react-grid-empty-header",
        ...props,
    };

    return <th {...headerProps} />;
};
