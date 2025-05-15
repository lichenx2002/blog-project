// src/redux/theme/actions.ts
import { TOGGLE_THEME, ToggleThemeAction } from './types';

export const toggleTheme = (): ToggleThemeAction => ({
    type: TOGGLE_THEME
});