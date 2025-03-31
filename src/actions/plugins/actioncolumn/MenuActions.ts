import { HIDE_MENU, SHOW_MENU } from "@/constants/ActionTypes";

export const showMenu = ({ id, stateKey }) => ({
    type: SHOW_MENU,
    id,
    stateKey,
});

export const hideMenu = ({ id, stateKey }) => ({
    type: HIDE_MENU,
    id,
    stateKey,
});
