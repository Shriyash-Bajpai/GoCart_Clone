//Function for creating the store 
import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {client} from "@/configs/imageKit";


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
                {width:'512'},
            ],
        });

        const newStore=await prisma.store.create({
            data:{
                userId:userId,
                name:name,
                username:username.toLowerCase(),
                description:description,
                email:email,
                contact:contact,
                address:address,
                logo:optImg,
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
        const formData=await request.formData();
        

        
        const store=await prisma.store.findFirst({
            where:{userId:userId}
        });
        if(store)
            return NextResponse.json({message:"Store already registered"},{status: store.status});
        else
            return NextResponse.json({message:"No store found"},{status:"Not Registered"});
    }
    catch(error){
        console.log("Error in fetching store:",error);
        return NextResponse.json({error: error.code || error.message},{status:400});
    }
}
