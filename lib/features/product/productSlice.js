import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { productDummyData } from '@/assets/assets'
import { fetchServerResponse } from 'next/dist/client/components/router-reducer/fetch-server-response'
import axios from 'axios';

//Use of REDUX
export const fetchProducts = createAsyncThunk('product/fetchProducts',
    async({storeId},thunkAPI)=>{
        try{
            const {data}=await axios.get("/api/products"+(storeId ? `storeId=${storeId}` : ''));
            return data.products;
        }catch(error){
            console.log("Error in product slice");
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchProducts.fulfilled, (state,action)=>{
            state.list=action.payload
        })
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer