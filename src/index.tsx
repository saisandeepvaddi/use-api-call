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
  request: (...args: any[]) => Promise<any>,
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
    [isMounted]
  );

  const invoke = React.useCallback(() => {
    (async (...args: any[]) => {
      try {
        updateState(setLoading, true);
        let responseData = await request(...args).catch((e: Error) => {
          throw e;
        });
        if (responseData) {
          updateState(setData, responseData);
        }
      } catch (error) {
        console.log("error:", error);
        updateState(setError, error);
      } finally {
        updateState(setLoading, false);
      }
    })();
  }, [updateState, setLoading, setData, setError]);

  React.useEffect(() => {
    if (_options.invokeOnMount) {
      invoke();
    }
  }, []);

  return {
    loading,
    data,
    error,
    invoke,
  };
}
