import OrderItem from "@/components/OrderItem";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from '@clerk/nextjs/server';

import { NextResponse } from "next/server";



//update seller order status
export async function POST(request){
    try{
        const {userId}=getAuth(request);
        const storeId=await authSeller(userId);
        if(!storeId)
            return NextResponse.json({message:"The user is not a seller"},{status:401});
        
        const {orderId,status}=await request.json();

        await prisma.order.update({
            where:{id:orderId},
            data:{
                status:status,
            }
        });

        return NextResponse.json({message:"Order status updated"},{status:200});

    }catch(error){
        console.log("Error in status orders api in store");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
} 


// get all orders of current seller
export async function GET(request){
    try{
        const {userId}=getAuth(request);
        const storeId=await authSeller(userId);
        if(!storeId)
            return NextResponse.json({message:"The user is not a seller"},{status:401});
        
        const orders=await prisma.order.findMany({
            where:{storeId:storeId},
            include:{user:true,address:true,orderItems:{include:{product:true}}},
            orderBy:{createdAt:'desc'}
        });

        return NextResponse.json({message:"List of all Orders",orders},{status:200});

    }catch(error){
        console.log("Error in get orders api in store");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
} 