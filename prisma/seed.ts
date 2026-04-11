import { seedUser } from "./seeds/userSeed";


async function main(){
   console.log("seeding started....");
   await seedUser();
   console.log("seeding completed ...")
}

main()
.then(() => {
    console.log("data seeded successfully ")
    process.exit(0);
})
.catch((error) => {
    console.log("error seeding data:", error);
})