//Function for creating the store 
import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import client from "@/configs/imageKit";
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// Register a non-crashing unhandledRejection handler in dev to avoid process exit
if (typeof process !== 'undefined' && process && typeof process.on === 'function') {
    if ((process.listeners && process.listeners('unhandledRejection').length === 0) || !process.listeners) {
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection (caught at top-level):', reason);
        });
    }
}


export async function POST(request) {
    try{
        const {userId} = getAuth(request);
        const formData=await request.formData();
        
        const name=formData.get("name");
        const username=formData.get("username");
        const description=formData.get("description");
        const email=formData.get("email");
        const contact=formData.get("contact");
        const address=formData.get("address");
        const image=formData.get("image");

        if(!name || !username || !description || !email || !contact || !address)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const store=await prisma.store.findFirst({
            where:{userId:userId}
        })

        if(store){
            return NextResponse.json({status: store.status})
        }

        const isUserNameTaken=await prisma.store.findFirst({
            where:{username:username.toLowerCase()}
        });
        if(isUserNameTaken)
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        
        let optImg = null;
        if (image) {
            // Ensure ImageKit credentials exist before attempting upload
            if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY) {
                console.error('ImageKit credentials missing in environment');
                return NextResponse.json({ error: 'Image upload not configured on server' }, { status: 500 });
            }
            try {
                const imgBuffer = Buffer.from(await image.arrayBuffer());
                const response = client.files.upload({
                    file: imgBuffer,
                    fileName: image.name,
                    folder: "logos",
                });
                console.log(response);

                optImg = client.helper.buildSrc({
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/shriyash',
                    src: response.filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '512' },
                    ],
                });
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                // Fallback: save to /public/uploads for local development so the rest of the flow can continue
                try {
                    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
                    await fs.mkdir(uploadsDir, { recursive: true });
                    const safeName = (image && image.name) ? image.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'upload';
                    const filename = `${Date.now()}-${safeName}`;
                    const filePath = path.join(uploadsDir, filename);
                    const buffer = Buffer.from(await image.arrayBuffer());
                    await fs.writeFile(filePath, buffer);
                    optImg = `/uploads/${filename}`;
                    console.warn('Saved image locally to', filePath);
                } catch (fsErr) {
                    console.error('Local save fallback failed:', fsErr);
                    return NextResponse.json({ error: uploadError.message || 'Image upload failed' }, { status: 400 });
                }
            }
        }



        const newStore=await prisma.store.create({
            data:{
                userId:userId,
                name:name,
                username:username.toLowerCase(),
                description:description,
                email:email,
                contact:contact,
                address:address,
                logo: optImg,
            }
        });

        await prisma.user.update({
            where:{id:userId},
            data:{
                store:{
                    connect:{id:newStore.id}
                }
            }
        });

        return NextResponse.json({message:"applied waiting for approval",});
        
    }catch(error){
        console.log("Error in creating store:",error);
        return NextResponse.json({error: error.code || error.message},{status:400});
    }
}


//if already reg a store, return status of store
export async function GET(request) {
    try{
        const {userId} = getAuth(request);
        const store=await prisma.store.findFirst({
            where:{userId:userId}
        });
        if(store)
            return NextResponse.json({ status: store.status, store }, { status: 200 });
        else
            return NextResponse.json({ status: 'Not Registered' }, { status: 200 });
    }
    catch(error){
        console.log("Error in fetching store:",error);
        return NextResponse.json({error: error.code || error.message},{status:400});
    }
}
