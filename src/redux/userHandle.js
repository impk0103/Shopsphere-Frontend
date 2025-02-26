import axios from 'axios';
import {
    authRequest,
    authSuccess,
    authFailed,
    authError,
    stuffAdded,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
    productSuccess,
    productDetailsSuccess,
    getProductDetailsFailed,
    getProductsFailed,
    setFilteredProducts,
    getSearchFailed,
    sellerProductSuccess,
    getSellerProductsFailed,
    stuffUpdated,
    updateFailed,
    getSpecificProductsFailed,
    specificProductSuccess,
    updateCurrentUser,
} from './userSlice';


import { getReq, getSuccess, getFailure } from './orderSlice';

// Authentication Handlers
export const authUser = (fields, role, mode) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}/${mode}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

// Add Product
export const addStuff = (fields) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/product`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

// Update Product
export const updateStuff = (fields, id) => async (dispatch) => {
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/product/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(updateFailed(result.data.message));
        } else {
            dispatch(stuffUpdated());
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// Delete Product
export const deleteStuff = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/product/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const deleteStuffs = (sellerId) => async (dispatch) => {
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/products/${sellerId}`);

        if (!result.ok) {
            dispatch(getFailed(result.data.message));
        }
        else{
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// Update Customer
export const updateCustomer = (fields, id) => async (dispatch) => {
    dispatch(updateCurrentUser(fields));
    const newFields = { ...fields };
    try {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateDetails/${id}`, newFields, {
            headers: { 'Content-Type': 'application/json' },
        });
       
        dispatch(stuffUpdated());
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// Get Products by Seller
export const getProductsbySeller = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Seller/products/${id}`);
        if (result.data.message) {
            dispatch(getSellerProductsFailed(result.data.message));
        } else {
            dispatch(sellerProductSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// Get All Products
export const getProducts = () => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`);

        if (result.data.message) {
            dispatch(getProductsFailed(result.data.message));
        } else {
            dispatch(productSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/product/${id}`);
        if (result.data.message) {
            dispatch(getProductDetailsFailed(result.data.message));
        } else {
            dispatch(productDetailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// Search Products
export const getSearchedProducts = (key1,key2) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/search/${key1}/${key2}`);
        if (result.data.message) {
            dispatch(getSearchFailed(result.data.message));
        } else {
            dispatch(setFilteredProducts(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};



// Get Specific Products
export const getOrdersForCustomer = (key, category, subcategory) => async (dispatch) => {
    dispatch(getRequest());
    try {
        let url = `${process.env.REACT_APP_BASE_URL}/order/customer/${key}`;
        const result = await axios.get(url);
        if (result.data.message) {
            dispatch(getSpecificProductsFailed(result.data.message));
        } else {
            dispatch(specificProductSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};



export const placeOrder = (orders) => async (dispatch) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/order`, orders, {
            headers: { 'Content-Type': 'application/json' },
        });
                
        if (!response.ok) {
            dispatch(updateFailed())
        }
        
        dispatch(stuffAdded());
    } catch (error) {
        console.error("Order placement failed:", error);
    }
};


export const placeOrders = (orders) => async (dispatch) => {
    const orderEntries = orders.orderedProducts.map(product => ({
        buyer: orders.buyer,
        shippingData: orders.shippingData,
        orderedProduct: product,
        paymentInfo: orders.paymentInfo,
        productsQuantity: product.quantity,
        totalPrice: product.price.mrp * product.quantity,
        sellerID: product.sellerID,
    }));
    
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/orders`, orderEntries, {
            headers: { 'Content-Type': 'application/json' },
        });
        

        if (response.data.length===0) {
            dispatch(updateFailed())
        }

        dispatch(stuffAdded());   
    } catch (error) {
        console.error("Order placement failed:", error);
    }
};



// Add Product
export const addAReview = (fields,id) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/review/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};




export const fetchSellerOrders = (id) => async (dispatch) => {
    dispatch(getReq());
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/order/seller/${id}`);
        dispatch(getSuccess(data));
    } catch (error) {
        dispatch(getFailure(error.response?.data?.message || "Something went wrong"));
    }
};
