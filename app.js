const express = require("express");        // express for creating server
const multer = require("multer");          // for parsing body (all kinds of data) specially image data / file data
const app = express();                      // for handling routes and creating the server
const morgan =require("morgan")             // logger , for logging every command
const bodyparser =require("body-parser") // for parsing the body of any request
const mongoose =require("mongoose");  // package to access database
const Student =require("./models/studentdata") // databse models
const Attendance =require("./models/attendance"); // database models
const Encodings=require("./models/encodings");
const { SeparableConvParams } = require("face-api.js/build/commonjs/common");



  
  

//********************************************************************************************************* */
// middlewares for parsing the request 


const storage=multer.diskStorage({           

    destination: function(req,file,cb){
        cb(null,"./uploads/")
    },

    filename : function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    },
    
});
const upload = multer({storage: storage});

const port="5000"
//  creating the server
app.listen(port, () => console.log("server running..."));

// serving the static folder
app.use(express.static('public'));

//logger

app.use(morgan('dev'));

// body parser
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//******************************************************************************************** */
// connecting to database

// database of name piet

var url = "mongodb://localhost:27017/piet";
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});


//************************************************************************************************//
// creating routes




// home page 

app.get("/", (req,res)=>{
    res.render("home.ejs");
});


//********************************************************************************** */
// route about author  
app.get("/register", (req,res)=>{

    res.render('registerStudent.ejs');

});


//************************************************************************************* */
// this route is for handling the image data sent by main page to verfiy the student
 // in single put the name of key you want to upload

 function matchFace(enc1,docs){

    
    const arr1 = Object.values(enc1);
    // console.log(arr1)
    var result=0
    var Dis=1;
    for(var j=0;j<docs.length;j++)
    {   var dis=0;
        const arr2 = Object.values(docs[j].encoding[0]);
        for(var i=0;i<128;i++)
        {
            dis=dis+(arr1[i]-arr2[i])*(arr1[i]-arr2[i]);
        }
        if(dis < Dis)
        {
            result=docs[j].roll;
            Dis=dis;
        }
       console.log(Math.sqrt(dis))
    }

    return(result);
 }

 app.post("/image",upload.single("image"),(req,res) =>{

    console.log("upload")
    var enc1=req.body.encodings;
    // console.log(enc1)
    Encodings.find().exec()
    .then((docs)=>{

       var enc2=docs[0].encoding[0]
       console.log("ok")
       var result=matchFace(enc1,docs)
       res.status(200).json({message:result});
    })
})


//****************************************************************************************** */
// this route is for handling the signup form for students data
// for parsing form body  use : req.body
// for parsing any file along with form  , use  : req.file

app.post("/submit",upload.single('face'),(req,res)=>{
        image=req.file
        const student = new Student({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        Roll : req.body.rollNo,
        Email : req.body.email,
        Mobile : req.body.mobile,
        Address : req.body.address,
        Zip : req.body.zip,
        City : req.body.city,

    });

    student.save().then(result =>{
        console.log(result)
    });
    res.render('uploadImage.ejs',{"Roll":req.body.rollNo});
    
})

//**************************************************************************************** */

// student inforamtion

app.get("/studentInfo",(req,res)=>{

    Student.find().exec()
    .then((docs)=>{
        console.log(docs); 
        res.render("students.ejs",{
            docs :docs,
        }); 
    })    
});
//************************************************************************************** */

// store roll no and encodings

app.post("/encodings",(req,res)=>{

    const encoding= new Encodings({
        encoding:req.body.encodings,
        roll:req.body.rollNo,
    })
    encoding.save().then(result =>{
        console.log(result)
    });
    console.log("what to do....?")
    // res.redirect('http://localhost:5000/register');
})


//************************************************************************************* */
// for defaulters

app.get("/defaulters",(req,res)=>{


    Attendance.find().exec()
    .then( (docs) =>{
    
    console.log(docs)
    
    res.render("defaulters.ejs");
    })

});
//********************************************************************************************** */

// face recog

app.use("/face",(req,res)=>{


})

//************************************************************************************** */
// for handling any other route that is not available

app.get("*",(req,res)=>{

    res.send("LOST YOUR WAY ?")
}) 