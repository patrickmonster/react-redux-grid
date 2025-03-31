import Grid from "./components/Grid";
import Store from "./store/store";

import { Reducers } from "./reducers";

import { Actions } from "./actions";

import * as ActionTypes from "./constants/ActionTypes";
import { applyGridConfig } from "./constants/GridConstants.js";

const modules = {
    Actions,
    Grid,
    Reducers,
    applyGridConfig,
    ActionTypes,
    Store,
};

export default modules;
