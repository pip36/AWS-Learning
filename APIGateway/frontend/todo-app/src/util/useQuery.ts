import { useEffect, useState } from "react";

type QueryResult<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
  invalidate: () => void;
};

export const useQuery = <T>(url: string): QueryResult<T> => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [invalidation, setInvalidation] = useState(0);

  let invalidate = () => setInvalidation(invalidation + 1);

  useEffect(() => {
    let isCancelled = false;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw "API ERROR";

        const data = await res.json();
        if (!isCancelled) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch((_) => {
        setIsError(true);
      });

    return () => {
      isCancelled = true;
      invalidate = () => {};
    };
  }, [invalidation]);

  return {
    data,
    isLoading,
    isError,
    invalidate,
  };
};
