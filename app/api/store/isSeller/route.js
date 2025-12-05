// check if the user is a seller
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/configs/prisma";
import { authSeller } from "@/utils/authSeller";

export async function POST(request) {
    try{
        const {userId}=getAuth(request);
        const storeId=authSeller(userId);
        if(storeId)
            return NextResponse.json({message:"The user is a authorized seller"},{storeId:res});
        

        const store=await prisma.store.findFirst({
            where:{userId:userId, storeId:storeId}
        });
        return NextResponse.json({message:"The user is a authorised seller"},{storeId:storeId},{store:store});

    }
    catch(error){
        console.log("Error in isSeller function");
        return NextResponse.json({error:error.code || error.message},{status:400});
    }
}