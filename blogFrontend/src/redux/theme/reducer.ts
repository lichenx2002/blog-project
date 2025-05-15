// src/redux/theme/reducer.ts
import { ThemeState, ThemeActionTypes, TOGGLE_THEME } from './types';

const initialState: ThemeState = {
    isDarkMode: false
};

const themeReducer = (
    state = initialState,
    action: ThemeActionTypes
): ThemeState => {
    switch (action.type) {
        case TOGGLE_THEME:
            return {
                ...state,
                isDarkMode: !state.isDarkMode
            };
        default:
            return state;
    }
};

export default themeReducer;