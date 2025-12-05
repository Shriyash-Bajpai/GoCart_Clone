import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { client } from '@/configs/imageKit';
import prisma from '@/lib/prisma';
import authSeller from '@/middlewares/authSeller';

//Add a new product

export async function POST(request) {
    try{

        const {userId} = getAuth(request);
        const storeId=await authSeller(userId);
        if(!storeId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const {name,description,mrp,price,images,category,inStock}=JSON.parse(formData.get("data"));
        if(!name || !description || !mrp || !price || !images || images.length===0 || !category || !inStock)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });


        const optImgs=[];
        for(const image of images){
            const imgBuffer=Buffer.from(await image.arrayBuffer());
                    const response = await client.files.upload({
                        file: imgBuffer,  // or other allowed file formats/streams
                        fileName: image.name,
                        folder:"logos",
                    });
                    console.log(response);
            
            
            
                    const optImg=client.helper.buildSrc({
                        urlEndpoint: 'https://ik.imagekit.io/shriyash',
                        src: response.filePath,
                        transformation: [
                            {quality:'auto'},
                            {format:'webp'},
                            {width:'1024'},
                        ],
                    });

                    optImgs.push(optImg);
        }

        const prod=await prisma.product.create({
            data:{
                name:name,
                description:description,
                mrp:mrp,
                price:price, 
                images:optImgs,
                category:category,
                inStock:inStock,
                storeId:storeId,
                
            }
        });

        return NextResponse.json({ message: "Product added successfully", product: prod }, { status: 201 });
    }
    catch(error){
        console.log("Error in adding product:",error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}




//Get all products of a seller
export async function GET(request) {

    try{
        const {userId} = getAuth(request);
        const storeId=await authSeller(userId);

        if(!storeId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const prod=await prisma.product.findMany({
            where:{storeId:storeId}
        });

        return NextResponse.json({ products: prod }, { status: 200 });

    }catch(error){
        console.log("Error in fetching products:",error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}