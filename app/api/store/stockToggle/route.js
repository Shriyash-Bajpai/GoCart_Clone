//toggle the the stock for a particular product in the store
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/dist/types/server';
import authSeller from '@/middlewares/authSeller';

export async function POST(request){
    try{
        const {userId}=getAuth(request);
        const formData=await request.formData();
        const productId=formData.get("productId");
        
        const storeId=await authSeller(userId);

        if(!productId)
            return NextResponse.json({ error: "Missing productId" }, { status: 400 });

        const product=await prisma.product.findFirst({
            where:{
                id:productId,
                storeId:storeId
            }
        });
        if(!product)
            return NextResponse.json({ error: "Product not found in your store" }, { status: 404 });
        const updateProd=await prisma.product.update({
            where:{id:productId},
            data:{
                inStock: !product.inStock,
            }
        });
        return NextResponse.json({message:"Stock status toggled", inStock: updateProd.inStock});
        
    }
    catch(error){
        console.log("Error in toggling stock:",error);
        return NextResponse.json({ error: error.message || error.code }, { status: 500 });
    }
}

