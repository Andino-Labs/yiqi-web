"use server"
import prisma from '@/lib/prisma'


export async function SearchUser(
    text: string
){
    try{
        const user = await prisma.user.findMany({
            where:{
                OR:[
                    {
                        name:{
                            contains: text,
                            mode: "insensitive"
                        },
                    },
                    {
                        email: {
                            contains: text,
                            mode: "insensitive"
                        }
                    }
                ]
                
            },
            select:{
                name:true,
                email: true,
                picture: true,        
            }
        })

        return user
        
        
    } catch(error){
        throw new Error(`${error}`)
    } finally{
        await prisma.$disconnect()
    }
}