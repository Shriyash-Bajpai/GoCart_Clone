import prisma from '@/lib/prisma';

const authSeller= async(userId)=>{

    try{
        
        const user= await prisma.user.findFirst({
            where:{id:userId},
            include:{store:true}
        });

        if(!user)
            return false;

        if(user.store.status==='APPROVED')
            return user.store.id;
        else
            return false;
        
        
    }
    catch(error){
        console.log("Error in authSeller middleware:",error);
        return false;
    }
}

export default authSeller;