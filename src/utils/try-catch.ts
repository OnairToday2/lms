export const tryCatch = async <T, E = Error>(
  promise: Promise<T>,
): Promise<[T, null] | [null, E]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
};
