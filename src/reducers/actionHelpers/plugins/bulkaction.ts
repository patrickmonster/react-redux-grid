import { BulkAction } from "@/records";
import getUpdatedRecord from "@/util/getUpdatedRecord";
import { generateLastUpdate } from "@/util/lastUpdate";

export const removeToolbar = (state, { stateKey, value }) =>
    getUpdatedRecord(
        state,
        stateKey,
        {
            isRemoved: value,
            lastUpdate: generateLastUpdate(),
        },
        BulkAction
    );
