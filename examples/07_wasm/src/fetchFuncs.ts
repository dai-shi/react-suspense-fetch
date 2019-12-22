export const fetchWasm = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const result = await WebAssembly.instantiateStreaming(response);
  return result.instance as {
    exports: {
      fib: (x: number) => number;
    };
  };
};

export default null;
