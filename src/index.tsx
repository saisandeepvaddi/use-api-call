import React from "react";
import { useMountedState } from "./util-hooks";

export interface IOptions {
  updateOnlyIfMounted?: boolean;
  invokeOnMount?: boolean;
}

export interface IApiCall {
  data: any | undefined;
  loading: boolean;
  error: Error | undefined;
  invoke: (args?: any) => void;
}

const defaultOptions: IOptions = {
  updateOnlyIfMounted: true,
  invokeOnMount: false,
};

export function useApiCall(
  request: string | ((...args: any[]) => Promise<any>),
  options: IOptions = defaultOptions
): IApiCall {
  const isMounted = useMountedState();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);

  const _options = {
    ...defaultOptions,
    ...options,
  };

  const updateState = React.useCallback(
    (updater, data) => {
      if (_options.updateOnlyIfMounted) {
        if (isMounted()) {
          updater(data);
        }
      } else {
        updater(data);
      }
    },
    [isMounted, _options.updateOnlyIfMounted]
  );

  const resetState = React.useCallback(() => {
    setLoading(false);
    setData(undefined);
    setError(undefined);
  }, []);

  const invoke = React.useCallback(
    (...args: any[]) => {
      resetState();
      const fetchData = async (...args: any[]) => {
        try {
          updateState(setLoading, true);
          let responseData;
          if (typeof request === "string") {
            const res = await fetch(request, ...args).catch((e: Error) => {
              throw e;
            });
            responseData = await res.json().catch((e: Error) => {
              throw e;
            });
          } else {
            responseData = await request(...args).catch((e: Error) => {
              throw e;
            });
          }
          if (responseData) {
            updateState(setData, responseData);
          }
        } catch (error) {
          updateState(setError, error);
        } finally {
          updateState(setLoading, false);
        }
      };

      fetchData(...args);
    },
    [updateState, setLoading, setData, setError, request]
  );

  React.useEffect(() => {
    if (_options.invokeOnMount) {
      invoke();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return {
    loading,
    data,
    error,
    invoke,
  };
}
