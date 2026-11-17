"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { installAuthInterceptors } from "@/api/api-fetch";
import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "./hooks";
import { refreshSession } from "./authSlice";
import { makeStore, type AppStore } from "./store";

function RefreshLoadingOverlay() {
  const [mounted, setMounted] = useState(false);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);

  useEffect(() => setMounted(true), []);

  return mounted && sessionChecked ? null : <LoadingScreen />;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(makeStore);

  useEffect(() => installAuthInterceptors(store), [store]);

  useEffect(() => {
    void store.dispatch(refreshSession());
  }, [store]);

  return (
    <Provider store={store}>
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        {children}
      </Suspense>
      <RefreshLoadingOverlay />
    </Provider>
  );
}
