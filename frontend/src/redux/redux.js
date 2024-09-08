import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";
import isAuthenticatedReducers from "./slices/isAuthenticatedSlice";
import usernameReducers from "./slices/usernameSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["isAuthenticated", "username"],
};
const rootReducer = combineReducers({
  isAuthenticated: isAuthenticatedReducers,
  username: usernameReducers,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
