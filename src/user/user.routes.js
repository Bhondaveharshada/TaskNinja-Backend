const express = require('express')
const router = express.Router()
const  userController  = require('./user.controller')
const multer = require('multer');
 
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads');
    },
    filename: function(req,file,cb){
        const date = new Date().toISOString().replace(/:/g, '-');
      cb(null, date  + file.originalname.toString())
    }
});

const filefilter = (req,file,cb)=>{
    if(file.mimetype==="image/jpeg" || file.mimetype==='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
};

const upload = multer(
    {storage:storage},
    {filefilter:filefilter}
);


router.post('/register', userController.handleRegisterUser);
router.post('/login', userController.handleUserLogin);
router.post('/checkemail', userController.checkEmailExist);

module.exports = router;