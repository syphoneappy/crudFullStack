import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from '../features/counters/CounterSlice'; 
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    user: userReducer
});

export const Store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: false,
    }),
});
