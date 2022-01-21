import { useEffect, useState } from "react";

type CommandResult<P, T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
  mutate: (payload: P) => void;
};

export const useCommand = <P, T = null>(
  url: string,
  method: "POST" | "PUT",
  callbacks: { afterSuccess: () => void }
): CommandResult<P, T> => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [payload, setPayload] = useState<P | null>(null);

  const mutate = (payload: P) => setPayload(payload);

  useEffect(() => {
    let isCancelled = false;

    if (payload) {
      fetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) throw "API ERROR";

          const data = await res.json();
          if (!isCancelled) {
            setData(data);
            setIsLoading(false);
            callbacks.afterSuccess();
          }
        })
        .catch((_) => {
          setIsError(true);
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [payload]);

  return {
    mutate,
    data,
    isLoading,
    isError,
  };
};
