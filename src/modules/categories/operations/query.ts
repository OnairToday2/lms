import { useTQuery } from "@/lib";
import { categoriesRepository } from "@/repository";
import { QUERY_KEYS } from "@/constants/query-key.constant";

const useGetCategoriesQuery = () => {
  return useTQuery({
    queryFn: categoriesRepository.getCategories,
    queryKey: [QUERY_KEYS.GET_CATEGORIES],
  });
};

export { useGetCategoriesQuery };
