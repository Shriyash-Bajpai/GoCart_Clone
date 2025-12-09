import prisma from '@/lib/prisma';

const authSeller= async(userId)=>{

    try{
        
        const user= await prisma.user.findFirst({
            where:{id:userId},
            include:{store:true}
        });

        if(!user)
            return false;

        //console.log(user.store);

        if(user.store.status.toUpperCase()==='APPROVED')
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