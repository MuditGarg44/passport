module.exports = (app)=>{
    const Users = require("../models/users.js");
    const bodyparser = require("body-parser");
    const passport = require("passport")
    var session = require("express-session")
    const LocalStrategy = require("passport-local");
    const cors = require("cors");

    app.use(cors());

    app.use(bodyparser.urlencoded({extended : false}));
    app.use(bodyparser.json());

    app.use(session({ 
        secret: 'something', 
        cookie: { 
            secure: false
        }}))
    app.use(passport.initialize());
    app.use(passport.session());



    passport.use(new LocalStrategy(function(username,password,done){
        Users.findOne( {name : username})
        .then(user=>{
            // return next(null, false, { message: 'Incorrect username.' })
            if(!user){
                return done('Incorrect username.');
            }
            if(!user.validatePassword(password)){
                return done('Incorrect password.');
            }
            return done(null, user);
        })
        .catch(err=> {
            return done(err);
        });
    }));

    passport.serializeUser(function(user,cb){
        console.log("Serializing user called with");
        cb(null, user);
    
    });
    passport.deserializeUser((user, cb) => {
        console.log("deserialize called");
        cb(null, user);
      });

    app.post("/adduser", (req,res)=>{
        let newuser = new Users({name : req.body.username});
        newuser.setPassword(req.body.password);
 
        newuser.save()
        .then(result=>{
            res.send(result);
        })
        .catch(err=>{
            res.send({
                isSuccess : false,
                err,
            });
        })
    })

    app.post("/login", passport.authenticate("local"), (req,res)=>{
        // res.redirect('/temp')
        if(req.user) {

            // res.redirect('/dashboard')
            // req.session = req.user;
            res.end(JSON.stringify({isSuccess : true, 
           message: "User Authenticated" }))
        }

        }
     );


    Authenticated = (req,res,next)=>{
        if(req.isAuthenticated())
        {
           return next();
        }
        else
        {
            console.log("inside else")
            console.log(req.sessionStore.sessions, "~~~~~")
            console.log(req.session);
            res.send({
                isAuth : false
            });
        }
    }

    app.get("/dashboard", Authenticated, (req,res)=>{

            console.log(req.user , "<<<<<<<<<")
            // res.send("trying to find req.user")
            res.end({
                isAuth : true
            });
        
    });
}