const User = require('./user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.handleRegisterUser = async(req,res,next)=>{
    console.log("body",req.body);
  await User.findOne({email:req.body.email})
   .exec()
   .then(user =>{
    if(user){
        return res.status(409).json({
            message:'Mail Already Exist'
        })
    }else{
        console.log(req.body.password);
        
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.status(500).json({
                    error:err
                })
            }else{
                const user = new User({
                    Name:req.body.name,
                    email:req.body.email,
                    password: hash,
                });
                user.save()
                .then(result=>{
                    res.status(201).json({
                        message:'User Created'
                    })
                })
                .catch(err=>{
                    res.status(500).json({
                        error:err
                    })
                })
            }
        })
    }
})
}


exports.handleUserLogin = async (req, res, next) => {
  console.log(req.body.email);

  await User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user.email) {
        return res.status(401).json({
          message: "email not Found",
        });
      } else if (!user.password) {
        return res.status(401).json({
          message: "invalid password",
        });
      }
      console.log(req.body.password);

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            meassage_pass: "Authentication failed..plz enter valid data",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_key,
          );
          console.log(token);
          return res.status(200).json({
            message: "Auth Successfull",
            token: token,
            user:{
              _id: user._id,
              name: user.Name,
              email: user.email,
            }
          });
        }
        res.status(401).json({
          meassage: "Incorrect Password",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.checkEmailExist = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        exists: true,
        message: 'Email already exists',
      });
    } else {
      return res.status(200).json({
        exists: false,
        message: 'Email not found',
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Internal server error',
    });
  }
};
