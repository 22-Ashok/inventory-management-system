import { prisma } from "../../src/lib/prisma";


export async function seedUser(){
    const user = await prisma.user.create({
        data:  {
            email: "alice@example.com",
            password: "hashedpassword1",
            f_name: "Alice",
            l_name: "Johnson",
            contact: "+1234567890",
            role: "ADMIN",
      }
    })

    console.log("user is:", user);
}



