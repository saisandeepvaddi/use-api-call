import { renderHook, act } from "@testing-library/react-hooks";
import { useApiCall } from "../src";

let fetch = (window.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ name: "fetch" }]),
  })
));

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

test.only("should work with fetch with options", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useApiCall("https://api.github.com/users")
  );

  const args = { username: "sai" };

  act(() => {
    result.current.invoke(args);
  });

  await waitForValueToChange(() => result.current.data, {
    timeout: 5000,
  });

  expect(fetch.mock.calls[0][1]).toBe(args);
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

test("should make request with fetch by default with invokeOnMount", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useApiCall("https://api.github.com", {
      invokeOnMount: false,
    })
  );

  act(() => {
    result.current.invoke();
  });

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual([{ name: "fetch" }]);
});

test("should make request without any promise fn", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useApiCall("https://api.github.com", {
      invokeOnMount: true,
    })
  );

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual([{ name: "fetch" }]);
});

// test.only("should update error on request fail.", async () => {
//   jest.setTimeout(10000);
//   const { result, waitForValueToChange } = renderHook(() =>
//     useApiCall(
//       () =>
//         axios.get("https://asdfasdf.github.com").then((res: any) => res.data),
//       {
//         invokeOnMount: true,
//       }
//     )
//   );

//   await waitForValueToChange(() => result.current.error);
//   expect(result.current.error).not.toBeNull();
// });
