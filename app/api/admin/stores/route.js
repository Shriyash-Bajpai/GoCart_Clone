import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import client from "@/configs/imageKit.js";
import prisma from "@/lib/prisma";
import {authAdmin} from "@/middlewares/authAdmin";



// Get all approved stores
export async function GET(request){

    try{
        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);

        if(!isAdmin)
            return NextResponse.json({error:"User is not admin"},{status:400});

        const list=await prisma.store.findMany({
            where:{status:"approved"},
            include:{user:true},
        });

        return NextResponse.json({list});

    }catch(error){
        console.log("Error in gettting all approved store",error);
        return NextResponse.json({error:error.message || error.code},{status:400});
    }
}