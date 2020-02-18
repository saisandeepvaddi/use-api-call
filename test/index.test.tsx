import { renderHook, act } from "@testing-library/react-hooks";
import { useApiCall } from "../src";
// import fetch from "isomorphic-fetch";
// import axios from "axios";

const fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ name: "fetch" }]),
  })
);

const axios = {
  get: jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: [{ name: "axios" }],
    })
  ),
};

test("should work with fetch", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useApiCall(() =>
      fetch("https://api.github.com/users").then((res: any) => res.json())
    )
  );

  act(() => {
    result.current.invoke();
  });

  await waitForValueToChange(() => result.current.data, {
    timeout: 5000,
  });

  expect(result.current.data).toEqual([{ name: "fetch" }]);
});

test("should work with axios", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useApiCall(() =>
      axios.get("https://api.github.com/users").then((res: any) => res.data)
    )
  );

  act(() => {
    result.current.invoke();
  });

  await waitForValueToChange(() => result.current.data, {
    timeout: 5000,
  });

  expect(result.current.data).toEqual([{ name: "axios" }]);
});

test("should work with auto invoke on mount", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useApiCall(
      () => axios.get("https://api.github.com").then((res: any) => res.data),
      {
        invokeOnMount: true,
      }
    )
  );

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual([{ name: "axios" }]);
});
