import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：用于实现输入值的去抖功能
 * @param value 需要去抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 去抖后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：在 value 或 delay 改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 