import { NextRequest, NextResponse } from "next/server";
import { authAdmin } from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {search} from "@/middlewares/search-coupon";

//Add new coupon
export async function POST(request){

    try{

        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);
        if(!isAdmin)
            return NextResponse.json({message:"User not authorized"},{status:401});

        //console.log(request);
        const {coupon}=await request.json();
        coupon.code=coupon.code.toUpperCase();

        if(search(coupon.code))
            return NextResponse.json({message:"Coupon with this code already exists."},{status:200});

        await prisma.coupon.create({
            data:coupon,
        });

        return NextResponse.json({message:"Coupon created successfully"},{status:200});


    }catch(error){
        console.log("Error in creating coupon.");
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
}



//Delete a coupon                   /api/coupon/id=couponId
export async function DELETE(request){

    try{

        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);
        if(!isAdmin)
            return NextResponse.json({message:"User not authorized"},{status:401});

        const url=new URL(request.url);
        const couponId=url.searchParams.get('id');

        OR 
        const {searchParams}=request.nextUrl;
        const code=searchParams.get('code');

        const isValid=await prisma.coupon.findFirst({
            where:{code:couponId}
        });

        if(!isValid)
            return NextResponse({message:"The given coupon code is invalid"},{status:401});
        

        await prisma.coupon.delete({
            where:{code:couponId},
        });
        
        return NextResponse.json({message:"The coupon deleted successfully"},{status:200});

    }catch(error){
        console.log("Error in deleting coupon");
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
}


//List all the coupons
export async function GET(request){
    try{

        const {userId}=getAuth(request);
        const isAdmin=await authAdmin(userId);
        if(!isAdmin)
            return NextResponse.json({message:"User not authorized"},{status:401});

        const coupons=await prisma.coupon.findMany();

        return NextResponse.json({message:"The coupons retrieved successfully",coupons},{status:200});

    }catch(error){
        console.log("Error in listing all coupons.");
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
} 


