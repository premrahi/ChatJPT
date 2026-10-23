import {Router } from "express" ;
import generate from "../assets/chatbot";

const chatRouter = Router() ;

chatRouter.post('/' , async(req , res) => {
    const {message , threadId } = req.body ;

    if(!message || !threadId) {
        res.status(400).json({message : "All fiends are required!"}) ;
        return ;
    }
    
    const response = await generate(message , threadId) ;

    console.log(response) ;
    res.json({success :"ok"  , response : response} ) ;

})

export default chatRouter ;