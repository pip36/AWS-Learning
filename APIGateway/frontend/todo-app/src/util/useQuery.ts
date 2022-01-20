import { useEffect, useState } from "react";

type QueryResult<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
};

export const useQuery = <T>(url: string): QueryResult<T> => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

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
    };
  }, []);

  return {
    data,
    isLoading,
    isError,
  };
};
