export const withLoading = async <T>(
  fn: () => Promise<T>,
  setLoading: (loading: boolean) => void
): Promise<T> => {
  try {
    setLoading(true);
    return await fn();
  } finally {
    setLoading(false);
  }
}; 