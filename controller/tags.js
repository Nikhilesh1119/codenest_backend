import Tags from '../models/Tags.js'

export const addTag = async(req, res)=>{
    try{
        const tag=await Tags.create({
            tagname: req.body.tagname,
            desc : req.body.desc
        })
        res.status(200).json({ "Success": "Added tags Successfully", "status": true })
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getTag = async(req, res)=>{
    try{
        let tags = await Tags.find();
        res.status(200).json(tags);
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const tagdesc=async(req, res)=>{
    try{
        let tag = await Tags.findOne({tagname : req.params.tagname});
        res.status(200).json(tag);
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}
