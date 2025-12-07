import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import client from "@/configs/imageKit.js";
import prisma from "@/lib/prisma";
import {authAdmin} from "@/middlewares/authAdmin";



// Toggle store status
export async function POST(request){

    try{
        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);

        if(!isAdmin)
            return NextResponse.json({error:"User is not admin"},{status:401});

        console.log(request);
        const {storeId}=await request.json();

        if(!storeId)
            return NextResponse.json({message:"StoreId is invalid"},{status:401});

        const store=await prisma.store.findFirst({
            where:{id:storeId}
        });

        if(!storeId)
            return NextResponse.json({message:"There is no store with given StoreId"},{status:401});


        await prisma.store.update({
                where:{id:storeId},
                data:{
                    isActive:!store.isActive,
                }
            });

        return NextResponse.json({message:"The isActive status toggled successfully"},{status:200});

    }catch(error){
        console.log("Error in toogle-store",error);
        return NextResponse.json({error:error.message || error.code},{status:400});
    }
}