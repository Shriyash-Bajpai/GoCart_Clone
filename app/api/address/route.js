import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";



//Add new address
export async function POST(request){
    try{
        
        const {userId}=getAuth(request);
        // console.log("In address api backend:",userId);
        const {address}=await request.json();
        address.userId=userId;
        console.log("Printing new address to be added in api of address backend",address);
        console.log("In adding new address:",userId);
        const newAdd=await prisma.address.create({
            data:address
        });
        return NextResponse.json({message:"Address added successfully", newAdd},{status:200});

    }catch(error){
        console.log("Error in adding new address in backend");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
}


//Get all address of current user
export async function GET(request){
    try{

        const {userId}=getAuth(request);
        // console.log("Get in address api:",userId);
        const add=await prisma.address.findMany({
            where:{userId:userId},
        });

        return NextResponse.json({message:"Address added successfully", add},{status:200});

    }catch(error){
        console.log("Error in fetching all addresses in backend");
        console.log(error);
        return NextResponse.json({message:error.message || error.code},{status:400});
    }
}



