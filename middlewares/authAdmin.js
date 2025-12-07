import prisma from '@/lib/prisma';
const {clerkClient} =require("@clerk/nextjs/server");

export const authAdmin = async(userId) => {

	try{

        if(!userId) return false;

        const client=await clerkClient();
        const user=await prisma.user.findFirst({
            where:{
                userId:userId,
            }
        });

        const email=user.email;
        if(process.env.ADMIN_EMAIL.split(',').includes(email))
            return user;
        else    
            return false;

    }catch(error){
        console.log(error);
        return false;
    }
}
