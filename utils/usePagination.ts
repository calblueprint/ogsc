import { useState, useEffect } from "react";
import { USER_PAGE_SIZE, UI_PAGE_SIZE } from "../constants";

interface FetchResponse<T> {
  data: T[];
  count: number;
}

const getBackendPageNumber = (uiPage: number): number[] => {
  /*
   * Takes in what page of the users dashboard you want to be displayed
   * Returns an array of pageNum and startIndex
   * pageNum is what page of the backend that you want to load
   * startIndex is what subsection of the backend page you want to grab (value can be 0, 1 or 2)
   * Note: assumes USER_PAGE_SIZE is 3x larger than UI_PAGE_SIZE
   */
  const pageNum = Math.floor((uiPage * UI_PAGE_SIZE) / USER_PAGE_SIZE);
  const startIndex = UI_PAGE_SIZE * (uiPage % 3);
  return [pageNum, startIndex];
};

export default function usePagination<UIDataType>(
  refreshTriggers: unknown[],
  fetchData: (pageNumber: number) => Promise<FetchResponse<UIDataType>>
): [UIDataType[], number, number, (page: number) => void] {
  const [uiPage, setUIPage] = useState(0);
  const [pageCache, setPageCache] = useState<Record<number, UIDataType[]>>({});

  // Values that will be returned and accessible by the parent component
  const [visibleData, setVisibleData] = useState<UIDataType[]>([]);
  const [numUIPages, setNumUIPages] = useState(0);

  useEffect(() => {
    setPageCache({});
    setUIPage(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refreshTriggers);

  useEffect(() => {
    const [backendPage, startIndex] = getBackendPageNumber(uiPage);

    const fetchResults = async (): Promise<UIDataType[]> => {
      if (backendPage in pageCache) {
        // Page already in cache; no need to make a request!
        return pageCache[backendPage];
      }

      const response = await fetchData(backendPage);
      setNumUIPages(Math.ceil(response.count / UI_PAGE_SIZE));
      setPageCache({
        ...pageCache,
        [backendPage]: response.data,
      });
      return response.data;
    };

    fetchResults().then((data) => {
      setVisibleData(data.slice(startIndex, startIndex + UI_PAGE_SIZE));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiPage, pageCache, ...refreshTriggers]);

  return [visibleData, numUIPages, uiPage, setUIPage];
}
