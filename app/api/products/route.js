import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



// GET the list of all products
export async function GET(request){

    try{

        const {user}=getAuth(request);
        let products=await prisma.product.findMany({
            where:{inStock:true},
            include:{rating:{select:{
                createdAt:true,rating:true,review:true,
                user:{select:{name:true,image:true}
            }
            }},
            store:true,    
        },
        orderBy:{createdAt:'desc'},
        });

        //remove products with store isActive false
        products=products.filter(product=>product.store.isActive);

        return NextResponse.json({message:"The products returned successfully",products},{status:200});

    }catch(error){
        console.log("Error in fetching the products in backend");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
}