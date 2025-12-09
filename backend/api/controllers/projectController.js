exports.list = (req,res)=>{ res.json({ok:true,projects:[]}) }; exports.create = (req,res)=>{ res.json({ok:true,created:req.body}) }
