// check if the user is a seller
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from '@/lib/prisma';
import authSeller from "@/middlewares/authSeller";

export async function POST(request) {
    try{
        const {userId}=getAuth(request);
        const storeId = await authSeller(userId);
        if(storeId)
            return NextResponse.json({ message: "The user is an authorized seller", storeId }, { status: 200 });

        return NextResponse.json({ message: "Not an authorized seller" }, { status: 401 });

    }
    catch(error){
        console.log("Error in isSeller function");
        return NextResponse.json({error:error.code || error.message},{status:400});
    }
}