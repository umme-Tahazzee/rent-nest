import app from "./app"
import { prisma } from "./lib/prisma";


const port = process.env.port || 5000
async function main(){
      try {
        await prisma.$connect()
        console.log('Connect Database successfully')
        app.listen(port,()=>{
               console.log(`Server is running on ${port}`);
               
        })          
      } catch (error) {
          
          console.log("Error starting in the server", error);
          await prisma.$disconnect()
          process.exit(1)
      }
}

main()