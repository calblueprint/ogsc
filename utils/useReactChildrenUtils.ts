import { useEffect, useState } from "react";

type ReactChildrenUtils = typeof import("react-children-utilities");

const useReactChildrenUtils = (): ReactChildrenUtils | null => {
  const [
    reactChildrenUtils,
    setReactChildrenUtils,
  ] = useState<ReactChildrenUtils | null>(null);
  useEffect(() => {
    import("react-children-utilities").then((reactChildrenModule) =>
      setReactChildrenUtils(reactChildrenModule)
    );
  }, []);

  return reactChildrenUtils;
};

export default useReactChildrenUtils;
