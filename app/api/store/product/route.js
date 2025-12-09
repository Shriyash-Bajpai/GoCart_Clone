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
        if(!storeId || typeof storeId!=="string")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const formData = await request.formData();


        const {name,description,mrp,price,category,inStock}=JSON.parse(formData.get("data"));
        const images=formData.getAll('images');
        //console.log("Received data:", {name, description, mrp, price, category, inStock, imagesCount: images.length});
        if(!name || !description || mrp===undefined || price===undefined || !images || !category )
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        // console.log("IMAGES FROM FORMDATA:", formData.getAll("images"));
        // console.log("DATA JSON:", formData.get("data"));


        const optImgs=[];
        for(const image of images){
            const imgBuffer=Buffer.from(await image.arrayBuffer());
            const mimeType = image?.type || 'image.png';
            const fileName = image?.name || 'logo.png';
            const base64=imgBuffer.toString('base64');
            const dataUrl=`data:${mimeType};base64,${base64}`;
                    const response = await client.files.upload({
                        file: dataUrl,  // or other allowed file formats/streams
                        fileName: fileName,
                        folder:"logos",
                    });
                    //console.log(response);
            
            
            
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

        const parsedMrp = parseFloat(mrp);
        const parsedPrice = parseFloat(price);
        const parsedStock = inStock === "true" || inStock === true;

        const prod=await prisma.product.create({
            data:{
                name:name,
                description:description,
                mrp:parsedMrp,
                price:parsedPrice, 
                images:optImgs,
                category:category,
                inStock:parsedStock,
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