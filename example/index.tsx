import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useApiCall } from "../dist";

const App = () => {
  const { data, invoke, loading } = useApiCall("https://api.github.com/users");

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

ReactDOM.render(<App />, document.getElementById("root"));
