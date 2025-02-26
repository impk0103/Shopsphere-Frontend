import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'orders',
    initialState: { sellerOrders: [], loading: false, error: null },
    reducers: {
        getReq: (state) => {
            state.loading = true;
            state.error = null;
        },
        getSuccess: (state, action) => {
            state.loading = false;
            state.sellerOrders = action.payload;
        },
        getFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearOrders: (state) => {
            state.sellerOrders = [];
            state.error = null;
        },
    },
});

export const { getReq, getSuccess, getFailure, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;