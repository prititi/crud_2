const express= require("express")
const {noteModel}= require("../model/notes.model")
const noteRoute= express.Router()

noteRoute.get("/",async(req,res)=>{
    try{
        const user= req.body.userID
        const data= await noteModel.find({userID:user})
        res.send(data)
    }
    catch(err){
        console.log(err);
    }
})


noteRoute.post("/create",async(req,res)=>{
    const payload= req.body
    const note= new noteModel(payload)
    await note.save()
    res.send({"msg":"Note Created"})
})


noteRoute.patch("/update/:id",async(req,res)=>{
    const id= req.params.id
    const data= req.body
    const note= await noteModel.findOne({"_id":id})
    const userID_in_note= note.userID
    const userID_making_req= req.body.userID

    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"You are not authorized"})
        }else{
            await noteModel.findByIdAndUpdate({"_id":id},data)
            res.send({"msg":`Note with id:${id} has been update`})
        }
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
    
})


noteRoute.delete("/delete/:id",async(req,res)=>{
    const id= req.params.id
    const note= await noteModel.findOne({"_id":id})
    const userID_in_note= note.userID
    const userID_making_req= req.body.userID
    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"You are not authorized"})
        }else{
            await noteModel.findByIdAndDelete({"_id":id})
            res.send({"msg":`Note with id:${id} has been delete`})
        }
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
    
})




module.exports={
    noteRoute
}