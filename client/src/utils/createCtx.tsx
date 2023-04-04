import React from "react";

const uninitializedAccess = {};

export function createCtx<A>(): readonly [
  () => A,
  () => React.Dispatch<React.SetStateAction<A>>,
  (
    props: React.PropsWithChildren<{ defaultValue: A; stateHandlers?: any }>
  ) => JSX.Element
] {
  type UpdateType = React.Dispatch<React.SetStateAction<A>>;
  const ctx = React.createContext(uninitializedAccess as any);
  function Provider(
    props: React.PropsWithChildren<{
      defaultValue: A;
      stateHandlers?: [A, UpdateType];
    }>
  ): JSX.Element {
    // Typescript doesn't seem to have a way to say 'one of these params, but not both'
    const localStateHandlers = React.useState(props.defaultValue);
    return (
      <ctx.Provider
        value={props.stateHandlers ?? localStateHandlers}
        {...props}
      />
    );
  }

  // If the user accesses this context and hasn't supplied a context provider, blow up
  const useContextSafe = (): any => {
    const ctxVal = React.useContext(ctx);
    if (ctxVal === uninitializedAccess) {
      throw new Error(
        "Uninitialized context access - make sure this call has a context provider somewhere up the DOM stack"
      );
    }
    return ctxVal;
  };

  return [
    () => useContextSafe()[0] as A, // the value getter
    () => useContextSafe()[1] as UpdateType, // the value setter
    Provider, // the data provider, using setState internally
  ] as const;
}
