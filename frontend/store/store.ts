import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { statementSlice } from "./records/statementSlice";
import { createWrapper } from "next-redux-wrapper";
import { recordsSlice } from "./recordsSlice";
import { workspacesSlice } from "./workspaceSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [statementSlice.name]: statementSlice.reducer,
      [recordsSlice.name]: recordsSlice.reducer,
      [workspacesSlice.name]: workspacesSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);