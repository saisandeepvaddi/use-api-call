# use-api-call

Minimal react hook to make api calls.

<p>
  <a href="https://badgen.net/bundlephobia/minzip/use-api-call@latest"><img src="https://badgen.net/bundlephobia/minzip/use-api-call@latest" /></a>
</p>

## Installation

> npm install use-api-call
>
> yarn add use-api-call

## Usage

```jsx
// See examples on adavanced usage.

import React from "react";
import { useApiCall } from "use-api-call";

function App() {
  const { data, error, loading, invoke } = useApiCall(
    "https://api.github.com/users"
  );

  React.useEffect(() => {
    invoke(); // You don't have to call invoke() if you pass option {invokeOnMount: true} to useApiCall()'s second argument. But, isn't it nice to have control when you trigger ajax call.
  }, []);

  if (loading) return <p>Loading...</p>;

  return <div>{data}</div>;
}
```

## API

- **useApiCall(request, [,options])**

  - `request` - Function | URL string - Any function that returns `Promise` with data (or) A api url that returns JSON (uses fetch by default). (See the examples section).
    - Example: `useApiCall(() => axios("/request/url/here").then(res => res.data))`
  - `options` - Object - Options object.

  - returns an object with {data, error, loading, invoke} values. See the [Returns](#Returns) section for details.

### Options

- updateOnlyIfMounted

  - Will update the data, error, loading values only if component is still mounted. Prevents "Can't perform a React state update on an unmounted component" warning.
  - Type: _Boolean_
  - **Default**: `true`

- invokeOnMount
  - Runs ajax request when the component is mounted automatically. Basically, it does `useEffect(() => { invoke(); }, [])`.
  - Type: _Boolean_
  - **Default**: `false`

### Returns

- data

  - Whatever is returned by your ajax call on success.
  - Type: _any_
  - **Default**: `undefined`

- loading

  - A loader indicating whether request is running. You don't have to change anything here.
  - Type: _Boolean_

- error

  - Error thrown by the request unmodified. i.e., Axios and fetch return different _Error_ object structure, you'll have to check their documentation.
  - Type: _Error_
  - **Default**: `undefined`

- invoke
  - A function which you'll call to run the ajax call. Invoke can take options that you normally send with your fetch or axios call. If you have passed your own function instead of passing URL string, You have to allow your function to take arguments. Please check the examples section to see how.
  - Type: _Function_

## Examples

Check [test/index.test.tsx](test/index.test.tsx) for all different examples. I'll update some React examples soon.

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

```jsx
// Without ajax library. Uses fetch by default. You might have to polyfill for wide browser support.
const App = () => {
  const { data, error, invoke, loading } = useApiCall(
    "https://api.github.com/users",
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

```jsx
// Pass arguments to axios.
const App = () => {
  const { data, error, invoke, loading } = useApiCall(
    (...args) => axios.get("https://api.github.com/users", ...args).then(res => res.data)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => invoke({headers: {Authorization: "Bearer 12345xcxcxc"}})}>Get Users</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```
