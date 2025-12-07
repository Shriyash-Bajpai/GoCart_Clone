import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import client from "@/configs/imageKit.js";
import prisma from "@/lib/prisma";
import {authAdmin} from "@/middlewares/authAdmin";


export async function POST(request){
    try{

        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);

        if(!isAdmin)
            return NextResponse.json({error:"User is not admin"},{status:400});

        const {storeId,status}=await request.json();

        if(status==='approved'){
            await prisma.store.update({
                where:{id:storeId},
                data:{
                    status:"approved",
                    isActive:"true",
                }
            });
        }
        else if(status==='rejected'){
            await prisma.store.update({
                where:{id:storeId},
                data:{
                    status:"rejected",
                }
            });
        }

        return NextResponse.json({message:status+" successfullly"},{status:200});
        

    }catch(error){
        console.log("Error in approve-store",error);
        return NextResponse.json({error:error.message || error.code},{status:400});
    }
}



// Get all pending and rejected requests
export async function GET(request){

    try{
        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);

        if(!isAdmin)
            return NextResponse.json({error:"User is not admin"},{status:400});

        const list=await prisma.store.findMany({
            where:{status:{in:["pending","rejected"]}},
            include:{user:true},
        });

        return NextResponse.json({list});

    }catch(error){
        console.log("Error in approve-store",error);
        return NextResponse.json({error:error.message || error.code},{status:400});
    }
}