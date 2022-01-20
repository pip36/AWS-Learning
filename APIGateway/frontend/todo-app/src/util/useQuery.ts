import { useEffect, useState } from "react";

type QueryResult<T> = {
  isLoading: boolean;
  data: T | null;
};

export const useQuery = <T>(url: string): QueryResult<T> => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let isCancelled = false;
    fetch(url).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        if (!isCancelled) {
          setData(data);
          setIsLoading(false);
        }
      } else {
        throw "IT WENT WRONG!!";
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    data,
    isLoading,
  };
};
