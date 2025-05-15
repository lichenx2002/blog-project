export const TOGGLE_THEME = 'TOGGLE_THEME';

export interface ThemeState {
    isDarkMode: boolean;
}

export interface ToggleThemeAction {
    type: typeof TOGGLE_THEME;
}

export type ThemeActionTypes = ToggleThemeAction;