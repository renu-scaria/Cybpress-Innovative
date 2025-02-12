let router = require('express').Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const Misc = require('../controllers/Misc')
const tokenModel = require('../models/tokenModel');

const defaults = require('../default');


router.post('/user/signup', async (req, res) => {
  
      try {
          let { name, email, phone, password,address,dob } = req.body;
  
          if (Misc.isnullorempty(name)) {
              res.status(200).json({
                  status: false,
                  msg: 'Please provide name'
              });
              return;
          }
          if (Misc.isnullorempty(email)) {
              res.status(200).json({
                  status: false,
                  msg: 'Please provide email'
              });
              return;
          }
          if (Misc.isnullorempty(phone)) {
              res.status(200).json({
                  status: false,
                  msg: 'Please provide phone'
              });
              return;
          }
          if (Misc.isnullorempty(password)) {
              res.status(200).json({
                  status: false,
                  msg: 'Please provide password'
              });
              return;
          }
  
          var checkUserEmail = await userModel.findOne({ email: email, status: { $ne: "Deleted" } });
          if (!Misc.isnullorempty(checkUserEmail)) {
              res.status(200).json({
                  status: false,
                  msg: 'Email already exists'
              });
              return;
          }
  
          var checkUserPhone = await userModel.findOne({ phone: phone, status: { $ne: "Deleted" } });
          if (!Misc.isnullorempty(checkUserPhone)) {
              res.status(200).json({
                  status: false,
                  msg: 'Phone number already exists'
              });
              return;
          }
  
          var hash = await bcrypt.hash(password, 10);
  
          var reg = new userModel({
              name: name,
              email: email,
              phone: phone,
              password: hash
          });
  
          if (!Misc.isnullorempty(address)) {
              reg.address = address;
          }
          if (!Misc.isnullorempty(dob)) {
              reg.dob = dob;
          }
  
          try {
              reg = await reg.save();
  
              res.status(200).json({
                  status: true,
                  msg: 'Registered successfully'
              });
              return;
          } catch (ex) {
              res.status(200).json({
                  status: false,
                  msg: 'Failed to register',
                  ex
              });
              return
          }
      } catch (e) {
          console.log(e)
          res.status(500).json({
              status: false,
              msg: 'Something went wrong',
              e
          });
          return;
      }
      // })
  });

//User Signin
router.post('/user/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (Misc.isnullorempty(username)) {
            res.status(200).json({
                status: false,
                msg: 'Please provide phone number'
            });
            return;
        }
        if (Misc.isnullorempty(password)) {
            res.status(200).json({
                status: false,
                msg: 'Please provide password'
            });
            return;
        }

        var user = await userModel.findOne({ role:"User", $or: [/* { email: username }, */ { phone: username }], status: { $ne: "Deleted" } });
        if (!Misc.isnullorempty(user)) {
            var result = await bcrypt.compare(password, user.password);
            // console.log(result)
            if (result == true) {                      

                var usercopy = JSON.parse(JSON.stringify(user));
                delete usercopy.password;
                var token = jwt.sign({
                    id: user._id,
                    user: {},
                    role: usercopy.role
                }, defaults.tokenSecret, { expiresIn: 31536000 });

                var tok = tokenModel({
                    userid: user._id,
                    tokenvalue: token,
                });
                await tok.save();

                res.status(200).json({
                    status: true,
                    msg: 'Login success',
                    token: token,
                    uid: user._id,
                    role: usercopy.role,
                    data: usercopy
                });
                return;
            } else {
                res.status(200).json({
                    status: false,
                    msg: 'Incorrect password'
                });
                return;
            }
        } else {
            res.status(200).json({
                status: false,
                msg: 'Invalid phone number'
            });
            return;
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            status: false,
            msg: 'Something went wrong',
            e
        });
        return;
    }
});
module.exports = router;