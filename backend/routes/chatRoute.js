import {Router } from "express" ;
import generate from "../assets/chatbot";

const chatRouter = Router() ;

chatRouter.post('/' , async(req , res) => {
    const {message } = req.body ;


    const response = await generate(message) ;

    console.log(response) ;
    res.json({success :"ok"  , response : response} ) ;

})

export default chatRouter ;