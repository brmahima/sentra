const express = require('express')

const bodyParser = require('body-parser')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Catogry = require('././modules/catogry')
const Gender = require('././modules/gender')
const Space = require('././modules/space')
const SpaceType = require('././modules/spaceType')
const Age = require('././modules/age')
const Possibility = require('././modules/Possibility')
const User = require('./modules/user')
const Post = require('././modules/post')
const Comment = require('././modules/comment')
const Result = require('./modules/result')
const bcrypt = require('bcrypt')
const multer = require("multer")
const jwt = require('jsonwebtoken');
const fs = require('fs')

const storage = multer.diskStorage({
    
    destination: (req, file, callBack) => {
       
       
        callBack(null, './uploads');
        
    },
    filename: (req, file, callBack) => {
        
        callBack(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }


})

const upload = multer({
    storage: storage
})



const app = express()

app.use(bodyParser.json())


app.use('/pdf', express.static(__dirname + '/uploads'))

var cors = require('cors')
app.use(cors())
User.belongsTo(Post, {
    foreignKey: 'userId'
})


// all about catogry and options *** statrt ***
app.get('/api/catogry',isAuthenticated, (req, res) => {
    Catogry.findAll().then((catogry) => {
    if(catogry){
        res.json({
            'query':1,
            'catogry':catogry
        })
    }
      
    })

})
app.get('/api/option/:catogry',isAuthenticated,upload.none(),(req,res)=>{

    let catogry = req.params.catogry
    Age.findAll({
        where: {
        Inside: {
            [Op.like]: '%'+catogry+'%'
        }
      }}).then((age) => {
        Space.findAll({
            where: {
            Inside: {
                [Op.like]: '%'+catogry+'%'
            }
          }}).then((space) => {
            
            SpaceType.findAll({
                where: {
                Inside: {
                    [Op.like]: '%'+catogry+'%'
                }
              }}).then((spacetype) => {
                
                Possibility.findAll({
                    where: {
                    Inside: {
                        [Op.like]: '%'+catogry+'%'
                    }
                  }}).then((possibility) => {
                    Gender.findAll({
                        where: {
                        Inside: {
                            [Op.like]: '%'+catogry+'%'
                        }
                      }}).then((gender) => {
                        res.json({
                            'gender':gender,
                            'age':age,
                            'space':space,
                            'spaceType':spacetype,
                            'possibitity':possibility
                        })
                       
                    })
                        
                })
            })
        })
       
    })
})
// all about catogry and options *** end ***



// all about users *** statrt ***
app.post('/api/user',upload.none(),(req,res)=>{
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        User.findOne({
            where:{
                phone:req.body.phone
            }
        }).then((result)=>{
            if(!result){
                let privateKey = fs.readFileSync('./private.pem', 'utf8');
              
                User.create({
                    fistName: req.body.fistName,
                    lastName:req.body.lastName,
                    phone: req.body.phone,
                    password: hash,
                    isAdmin: true
            
                }).then((user) => {
                    let token = jwt.sign({ "user": user }, privateKey, { algorithm: 'HS256'})
                    res.json({
                        'query': 1,
                        'token':token})
                })
            }else{
                res.json({
                    'query':-1,
                    'cuase':'This account it exist'
                })
            }
        })
       
    })
})
app.get('/api/user',(req,res)=>{
    User.findAll().then((user)=>{
      
           res.json({
            'query': 1,
            'user':user
        }) 
    
       
    })
})
app.put('/api/user',upload.none(), (req, res) => {

    User.findByPk(req.body.userId).then((user) => {
        //check if exisits
        if (user) {
            // updating
            user.update(req.body).then((userU) => {
                res.json({
                    'query': 1,
                    'user':userU})
            })
        } else {
            res.json({
                'query': -1,
                "cause": "not found"
            })
        }

    })
})
app.get('/api/login',upload.none(),(req,res)=>{
    
    User.findOne({
        where:{
            phone:req.body.phone
        }
    }).then((user)=>{
        if(user){
            let privateKey = fs.readFileSync('./private.pem', 'utf8');
            let token = jwt.sign({ "user": user}, privateKey, { algorithm: 'HS256'});
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result){
                    user.Password = ""
                    res.json({
                        'query': 1,
                        'token':token
                    })
                }else{
                    res.json({
                        'query':-1,
                        'cuase':'The password inccorect'
                    })
                }
            })
        }else{
            res.json({
                'query':-1,
                'cuase':'This account it not exist'
            })
        }
    })
  

})
// all about users *** end ***





// all about posts *** statrt ***

app.post('/api/postImage',isAuthenticated,upload.single('image'),(req,res)=>{

    let privateKey = fs.readFileSync('./private.pem', 'utf8')
    var today = new Date()
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()



    jwt.verify(req.headers.authorization.split(" ")[1], privateKey,
     { algorithm: "HS256" }, (err, user) => {
     
        Post.create({
            postDetials:req.body.postDetials,
            image:req.file.filename,
            date:date,
            time:time,
            userId:user.user.userId
    
        }).then((post) => {
    
            if(post){
                res.json({
                    'query': 1,
                    'post':post
                })
            }else{
                res.json({
                    'query': -1,
                    'cuase':'error'
                }) 
            }
           
        })
    
    })
            
        })
app.post('/api/post',isAuthenticated,upload.none(),(req,res)=>{

    let privateKey = fs.readFileSync('./private.pem', 'utf8')
    var today = new Date()
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()



    jwt.verify(req.headers.authorization.split(" ")[1], privateKey,
     { algorithm: "HS256" }, (err, user) => {
     
        Post.create({
            postDetials:req.body.postDetials,
            image:"",
            date:date,
            time:time,
            userId:user.user.userId
    
        }).then((post) => {
    
            if(post){
                res.json({
                    'query': 1,
                    'post':post
                })
            }else{
                res.json({
                    'query': -1,
                    'cuase':'error'
                }) 
            }
           
        })
    
    })
            
        })
app.get('/api/post',isAuthenticated,(req,res)=>{
            Post.findAll({order: [
                ['date', 'desc'],
                ['time', 'desc']
             ]}).then((post)=>{
              
                   res.json({
                    'query': 1,
                    'post':post
                }) 
            
               
            })
        })
app.put('/api/post',isAuthenticated,upload.none(), (req, res) => {
        
            Post.findByPk(req.body.postId).then((post) => {
                //check if exisits
                if (post) {
                    // updating
                    post.update(req.body).then((postU) => {
                        res.json({
                            'query': 1,
                            'post':postU})
                    })
                } else {
                    res.json({
                        'query': -1,
                        "cause": "not found"
                    })
                }
        
            })
        })
app.delete('/api/post/:id',isAuthenticated, (req, res) => {
            let id = req.params.id
        
            Post.findByPk(id).then((post) => {
                //check if exisits
                if (post) {
                   
                   post.destroy().then(()=>{
                       res.json({
                        'query': 1,
                        "cause": "deleted"
                       })
                   })
                } else {
                    res.json({
                        'query': -1,
                        "cause": "not found"
                    })
                }
        
            })
        })
// all about posts *** end ***


// all about result *** statrt ***
app.post('/api/result',isAuthenticated,upload.single('pdfName'),(req,res)=>{
    Result.findOne({
        where:{
            equation:req.body.equation
        }
    }).then((result)=>{
        if(!result){
            Result.create({
                shortResult: req.body.shortResult,
                equation: req.body.equation,
                pdfName: req.file.filename
        
            }).then((resu) => {
                    if(resu){
                        res.json({
                            'query': 1,
                            'result':resu})
                    }else{
                        res.json({
                            'query':-1,
                            'cause':'error'})
                    }
               
            })
        }else{
            fs.unlinkSync('./uploads/'+req.file.filename)
            res.json({
                'query': -1,
                'cuase':'The result its found'}) 
        }
    })
})

app.get('/api/result',isAuthenticated,upload.none(),(req,res)=>{
    Result.findAll({
        where :{
            Equation:req.body.Equation
        },
        attributes:['resultId','shortResult','equation']
    }).then((result)=>{
              if(result){
                res.json({
                    'query': 1,
                    'result':result
                }) 
            
              }else{
                res.json({
                    'query': -1,
                    'cause':'not found'
                }) 
            
              }
       
    
 })
})

app.get('/api/allResult',isAuthenticated,(req,res)=>{
    Result.findAll().then((result)=>{
        if(result){
            res.json({
                'query': 1,
                'result':result
            }) 
        
        }else{
            res.json({
                'query': -1,
                'cause':'not found'
            }) 
        
        }
    })
})

app.get('/api/download',upload.none(),(req,res)=>{
    Result.findOne({
        where :{
            Equation:req.body.Equation
        },
        attributes:['pdf_name']
    }).then((result)=>{
              console.log(result)
        res.json({
         'query': 1,
         'url':"http://localhost:3001/uploads/"+result.dataValues.pdf_name
     }) 
 
    
 })
})
// all about result *** end ***



        function isAuthenticated(req, res, next) {
            if (typeof req.headers.authorization !== "undefined") {
              
                let token = req.headers.authorization.split(" ")[1];
                let privateKey = fs.readFileSync('./private.pem', 'utf8');
            
                jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
                  
                    
                
                    if (err) {  
                     
                        res.json({ 'query':-1,'cuase': "Not Authorized" });
                
                    }
                
                    return next();
                });
            } else {
         
                res.json({ 'query':-1,'cuase': "Not Authorized" });
             
            }
        }


   


app.listen(3001,()=>{
    console.log('server is running in port 3001')
    })