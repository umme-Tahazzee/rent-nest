import app from "./app"


const port = process.env.port || 5000
async function main(){
      try {
        app.listen(port,()=>{
               console.log(`Server is running on ${port}`);
               
        })          
      } catch (error) {
          console.log("Error starting in the server", error);
          process.exit(1)
      }
}

main()