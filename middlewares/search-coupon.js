import { NextRequest, NextResponse } from "next/server";
import { authAdmin } from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

//Search for a coupon
export async function search(code){
    try{

        const coupon=await prisma.coupon.findFirst({
            where:{code:code},
        });

        return coupon;

    }catch(error){
        console.log("Error in listing all coupons.");
        return error;
    }
} 