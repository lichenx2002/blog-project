// hooks/useTheme.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useTheme = () => {
    const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
    return { isDarkMode };
};