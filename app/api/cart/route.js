import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";




//Update user cart
export async function POST(request){

    try{    

        const {userId}=getAuth(request);
        const {cart}=await request.json();
        await prisma.user.update({
            where:{id:userId},
            data:{cart:cart},
        });

        return NextResponse.json({message:"The cart has been updated"});

    }catch(error){
        console.log("Error in updating the cart in backend");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
} 



//Get user cart
export async function GET(request){
    try{

        const {userId}=getAuth(request);
        const data=await prisma.user.findUnique({
            where:{id:userId},
        });
        
        // console.log("Get in cart api:",data);
        const cart=data.cart;
        return NextResponse.json({message:"User cart fetched",cart},{status:200});
        
    }catch(error){
        console.log("Error in fetching the cart in backend");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
}