import React from 'react';
import { useMountedState } from 'util-hooks';

interface IOptions {
  updateIfMounted: boolean;
  invokeOnRender: boolean;
}

export function useApiCall(
  request: any,
  options: IOptions = {
    updateIfMounted: true,
    invokeOnRender: false,
  }
) {
  const isMounted = useMountedState();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const updateState = React.useCallback(
    (updater, data) => {
      if (options.updateIfMounted) {
        if (isMounted()) {
          updater(data);
        }
      } else {
        updater(data);
      }
    },
    [isMounted]
  );

  const invoke = async (...args: any[]) => {
    try {
      updateState(setLoading, true);
      let responseData = await request(...args);
      if (responseData) {
        updateState(setData, responseData);
      }
    } catch (error) {
      console.log('error:', error);
      updateState(setError, error);
    } finally {
      updateState(setLoading, false);
    }
  };

  React.useEffect(() => {
    if (options.invokeOnRender) {
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
