import { Cell } from "@/components/layout/table-row/row/Cell";

export const EmptyCell = (props) => {
    const cellProps = {
        style: {
            width: "100%",
        },
        ...props,
    };

    return <Cell {...cellProps} />;
};
