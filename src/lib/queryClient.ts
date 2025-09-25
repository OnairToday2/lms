import { QueryClient } from "@tanstack/react-query";
import { useQuery, useMutation, useQueries } from "@tanstack/react-query";

const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 3,
      },
    },
  });
};

export {
  getQueryClient,
  useQuery as useTQuery,
  useMutation as useTMutation,
  useQueries as useTQueries,
};
