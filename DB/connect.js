const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/2tab-WebScrapping",
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
}).then(()=>
{
    console.log("connection is successful");
}).catch((e)=>{
    console.log("connection is UNsuccessful"+e);
});
