# use-api-call

Minimal and customizable react hook to make api calls

#--- Work In Progress ---

## API

- useApiCall(fn, [,options])

  - `fn` - Any function that returns `Promise` with data.
    - Example: `useApiCall(() => fetch("/request/url/here"))`
  - `options` - Options

    - ```ts
      interface IOptions {
        // data, error, loading will not be updated if component unmounted. Prevents "Can't perform a React state update on an unmounted component" warning.
        updateOnlyIfMounted?: boolean; // default true
        // Automatically invoke api call on mount.
        // useEffect(() => {...here}, [])
        invokeOnMount?: boolean; // default false
      }
      ```

  - returns object with following structure
    - ```ts
      interface IApiCall {
        data: any | undefined;
        loading: boolean;
        error: Error | undefined;
        invoke: (args?: any) => void;
      }
      ```

## Examples

Examples can be found in [examples](/example) folder.

```jsx
// Manual invoke
const App = () => {
  const { data, error, invoke, loading } = useApiCall(() =>
    fetch("https://api.github.com/users").then((res: any) => res.json())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => invoke()}>Click</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

```jsx
// Auto invoke on mount
const App = () => {
  const { data, error, invoke, loading } = useApiCall(
    () => fetch("https://api.github.com/users").then((res: any) => res.json()),
    {
      invokeOnMount: true,
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```
