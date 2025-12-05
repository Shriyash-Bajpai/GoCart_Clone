// Get store info and store products

import authSeller from "@/middlewares/authSeller";
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request){
    try{

        const {searchParams}=new URL(request.url);
        const username=searchParams.get("username").toLowerCase();
        if(!username)
            return NextResponse.json({message:"The username is invalid"},{status:400});

        const store=await prisma.store.findFirst({
            where:{username:username, isActive:true},
            include:{Product:{include:{rating:true}}}
        });

        if(!store)
            return NextResponse.json({message:"The username is invalid"},{status:400});

        return NextResponse.json({store});
        

    }catch(error){
        console.log("Error in getting Store Data");
        return NextResponse.json({message:"There is error in getting store data"},{error:error.code || error.message},{status:400});
    }
}