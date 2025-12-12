import { addressDummyData } from '@/assets/assets'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import prisma from '@/lib/prisma';
import { useAuth } from '@clerk/clerk-react';


export const fetchAddress=createAsyncThunk('address/fetchAddress',
    async({getToken},thunkAPI)=>{
        try{
            const token=await getToken();
            const {data}=await axios.get('api/address',{
                headers:{Authorization:`Bearer ${token}`}
            });
            console.log("Printing fetched addresses in slice:",data.add);
            return data ? data.add : [];
        }catch(error){
            console.log("Error in address slice");
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.value);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAddress.fulfilled, (state,action)=>{
            state.list=action.payload
        })
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer