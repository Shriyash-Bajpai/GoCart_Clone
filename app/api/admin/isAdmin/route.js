import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import client from "@/configs/imageKit.js";
import prisma from "@/lib/prisma";
import {authAdmin} from "@/middlewares/authAdmin";


//check if the current user is admin 
export async function GET(request){

    try{
        const {userId}=getAuth(request);

        const isAdmin=await authAdmin(userId);
        
        if(isAdmin)
            return NextResponse.json({isAdmin});
        else
            return NextResponse.json({error:"Not Authorized"},{status:401});

    }catch(error){
        console.log("Error in isAdmin");
        return NextResponse.json(
            {error:error.message || error.code},{status:400}
        );
    }

}