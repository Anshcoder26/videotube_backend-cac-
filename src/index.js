import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`SERVER IS RUNNING AT : ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MONGO DB CONNECTION FAILED!!!!", err);
})