import { SORT_DIRECTIONS } from "@/constants/GridConstants";

export default (name: string, direction: string, datasource: any) => {
    return datasource.data.sort((a, b) => {
        if (a.get(name) < b.get(name) && direction) {
            return direction === SORT_DIRECTIONS.ASCEND ? 1 : -1;
        } else if (a.get(name) > b.get(name)) {
            return direction === SORT_DIRECTIONS.ASCEND ? -1 : 1;
        }
    });
};
