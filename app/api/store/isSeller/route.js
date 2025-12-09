// check if the user is a seller
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
    try{
        const {userId}=getAuth(request);
        const storeId=authSeller(userId);
        if(!storeId)
            return NextResponse.json({message:"The user is a authorized seller",isSeller:false,store:null,storeId:null},{status:400});
        

        const store=await prisma.store.findFirst({
            where:{userId:userId, id:storeId}
        });
        const isSeller=store ? true : false;
        return NextResponse.json({message:"The user is a authorised seller",storeId:storeId,store:store,isSeller:isSeller},{status:200});

    }
    catch(error){
        console.log("Error in isSeller function");
        return NextResponse.json({error:error.code || error.message},{status:400});
    }
}