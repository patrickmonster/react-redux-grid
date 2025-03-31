import { DISMISS_ERROR, ERROR_OCCURRED } from "@/constants/ActionTypes";

export const dismissError = ({ stateKey }) => ({
    type: DISMISS_ERROR,
    stateKey,
});

export const setError = ({ stateKey, error }) => ({
    type: ERROR_OCCURRED,
    stateKey,
    error,
});
