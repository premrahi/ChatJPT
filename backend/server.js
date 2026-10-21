import express  from "express" ;
import chatRouter from "./routes/chatRoute";
import cors from "cors";

const app = express() ;
const PORT = 4000 ;

app.use(cors());
app.use(express.json()) ;

app.get( '/health' , (req , res) => {
    res.json({ message : "server is running fine"}) ;

})

app.use('/chat' , chatRouter) ;


app.listen(PORT , () => {
    console.log(`Server is up and running at port : ${PORT} `) ;
})