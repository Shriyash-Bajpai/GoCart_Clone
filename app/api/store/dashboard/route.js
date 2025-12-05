// Get Dashboard data for seller

import authSeller from "@/middlewares/authSeller";
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        const {userId}=getAuth(request);
        const storeId=await authSeller(userId);

        const store=await prisma.store.findFirst({
            where:{userId:userId}
        });

        const orders=await prisma.order.findMany({
            where:{storeId:storeId}
        });

        const prod=await prisma.product.findMany({
            where:{storeId:storeId}
        });

        const ratings=await prisma.rating.findMany({
            where:{productId: {in: prod.map(product=>product.id)}},
            include:{user:true,product:true}
        });


        const dashboardData={
            ratings,
            totalOrders:orders.length,
            totalEarnings:Math.round(orders.reduce((acc,order)=>acc+order.total,0)),
            totalProducts: prod.length,
        }

        return NextResponse.json({data:dashboardData});

    }catch(error){
        return NextResponse.json({error:error.message || error.code},{status:500});
    }
}