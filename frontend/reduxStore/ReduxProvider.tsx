"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { installAuthInterceptors } from "@/api/api-fetch";
import { refreshSession } from "./authSlice";
import { makeStore, type AppStore } from "./store";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(makeStore);

  useEffect(() => installAuthInterceptors(store), [store]);

  useEffect(() => {
    void store.dispatch(refreshSession());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
