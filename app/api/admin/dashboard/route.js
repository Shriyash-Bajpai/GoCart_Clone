import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import client from "@/configs/imageKit.js";
import prisma from "@/lib/prisma";
import {authAdmin} from "@/middlewares/authAdmin";


// Get the data for admin like total Orders,stores,products,revenue
export async function GET(request){

    try{

        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);

        if(!isAdmin)
            return NextResponse.json({error:"User is not admin"},{status:401});

        //total orders
        const orders=await prisma.order.count();
        // total stores
        const stores=await prisma.store.count();
        //get all orders include only createdAt and total and calc total revenue
        const orderList=await prisma.order.findMany({
            select:{
                createdAt:true,
                total: true,
            }
        });

        let rev=0;
        orderList.map((item)=>{
            rev+=item.total
        });
        rev=rev.toFixed(2);

        //total products on app
        const prod=await prisma.product.count();


        const dashboardData={
            orders,
            stores,
            prod,
            rev,
            orderList,
        };

        return NextResponse.json(dashboardData);

    }catch(error){
        console.log("Error in dashboard",error);
        return NextResponse.json({error:error.message || error.code},{status:400});
    }
}