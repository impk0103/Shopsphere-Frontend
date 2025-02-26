import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userSlice';
import orderReducer from './orderSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        orders: orderReducer
    }
});

export default store;