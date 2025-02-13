const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');

var jwt = require('jsonwebtoken');

const Misc = require('../controllers/Misc')

const defaults = require('../default');

module.exports = async function (req, res, next) {
    try {
        var token = req.body.token || req.query.token || req.headers.token;
        if (token) {
            try {
                var user = await jwt.verify(token, defaults.tokenSecret);
                if (user) {
                    req.user = user;
                    
                    var user = await userModel.findOne({ _id: req.user.id, role:"User", status: { $ne: "Deleted" } }, { password: 0 });
                    var tok = await tokenModel.findOne({ userid: req.user.id, tokenvalue: token, status: 'active' });
                    if (Misc.isnullorempty(tok)) {
                        res.status(200).json({
                            status: false,
                            expired: true,
                            msg: 'Invalid token, need to login again.'
                        });
                        return;
                    }
                    if ((!Misc.isnullorempty(user))) {
                        req.user.user = user;
                        next();
                    }
                    else {
                        res.status(200).json({
                            status: false,
                            msg: 'Access Denied.'
                        });
                        return;
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        expired: true,
                        msg: 'Failed to authenticate token.'
                    });
                    return;
                }
            } catch (e) {
                console.log(e)
                res.status(200).json({
                    status: false,
                    expired: true,
                    msg: 'Token expired, need to login again.'
                });
                return;
            }

        } else {
            res.status(200).json({
                status: false,
                expired: true,
                msg: 'No token provided.'
            });
            return;
        }

    } catch (e) {
        res.status(500).json({
            status: false,
            expired: true,
            msg: 'Something went wrong!!!'
        });
        return;
    }
};


