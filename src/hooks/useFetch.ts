import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
  data: T | null;
  error: string | null;
  // কোন রিকোয়েস্টের জন্য ফলাফল এসেছে (tick + deps এর সংকেত)
  settledKey: string | null;
}

export const useFetch = <T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
) => {
  const [state, setState] = useState<State<T>>({
    data: null,
    error: null,
    settledKey: null,
  });
  const [tick, setTick] = useState(0);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // বর্তমান রিকোয়েস্টের পরিচয়
  const requestKey = JSON.stringify([...deps, tick]);

  useEffect(() => {
    const controller = new AbortController();

    fetcherRef
      .current(controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        setState({ data: res, error: null, settledKey: requestKey });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          data: prev.data,
          error: err instanceof Error ? err.message : "Something went wrong",
          settledKey: requestKey,
        }));
      });

    return () => controller.abort();
  }, [requestKey]);

  // ফলাফল এখনো না এলে মানে লোড হচ্ছে, আলাদা state লাগে না
  const isLoading = state.settledKey !== requestKey;

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    data: state.data,
    error: isLoading ? null : state.error,
    isLoading,
    refetch,
  };
};