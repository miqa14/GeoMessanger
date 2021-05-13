const { Router, request, response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')
const logger = require('../middleware/logger')
const Todo = require('../models/TodoModel')
const router = Router()
const fileMiddleware = require('../middleware/file')
const authControl = require('../middleware/authControl')
const Lobby = require('../models/lobbyModel')

router.get('/login',(request,response) =>{

    response.render('Login',{
        pageTitle: 'Todo application | LOGIN',
        isLogin: true,
        error: request.flash("error"),
        info: request.flash("info")
    })
})

router.post('/login',async(request,response) =>{
    await Object.values(request.body).map(value => {
        if(value === null || value === undefined || value === ""){
            request.flash("error","please enter all form field")
            response.redirect("/auth/login")
        }
    })

    User
        .findOne({ email: request.body.email })
        .exec()
        .then(async (document) =>{
            const areSame = await bcrypt.compare(request.body.password, document.password)

            if(areSame){
                request.session.user = document
                request.session.isAuthenticated = true
                response.redirect('/auth/home')
            }else{
                request.flash("error","wrong password")
                response.redirect("/auth/login")
            } 
            }
            
        )
        .catch((error)=>{
            request.flash("error","This email not found in mongoDB")
            response.redirect("/auth/login")
        })
})

router.get('/registration',(request,response) =>{

    response.render('Registration',{
        pageTitle: 'Todo application | REGISTRATION',
        isRegistration: true,
        error: request.flash("error"),
        info: request.flash("info")
    })
})

router.post('/registration', fileMiddleware.single('photo'), async(request,response) =>{
    try{
    const {user_name, email, password, confirm_password} = request.body

    if(request.file.filename === null || request.file.filename === undefined || request.file.filename === ""){
        request.flash("error","Please Upload Profile Photo")
        response.redirect('/auth/registration')
    }

    await Object.values(request.body).map(value => {
        if(value === null || value === undefined || value === ""){
            request.flash("error","please enter all form field")
            response.redirect("/auth/registration")
        }
    })

    if(password === confirm_password){

        const candidat = await User.findOne({ email })
        const find = await User.findOne({ user_name })

        if(candidat || find){
            request.flash("info","this email or user name alredy used")
            response.redirect('/auth/registration')
        }else{
            const hashPassword = await bcrypt.hash(password, 10)

            console.log(request.file,'THIS on auth routes');

            const newUser = new User({
                user_name: request.body.user_name,
                first_name: request.body.first_name,
                last_name: request.body.last_name,
                birth_date: request.body.birth_date,
                email: request.body.email,
                photo: request.file.filename,
                password: hashPassword
            })

            await newUser.save()

            request.flash("info","congrats now you can sign in our application")
            response.redirect('/auth/login')
        }
    }else{
        request.flash("error","please check password or confirm password")
        response.redirect('/auth/registration')
    }
    }catch{
        console.error()
    }

    
})

router.get('/logout',(request,response)=>{
    request.session.destroy(()=>{
        response.redirect('/auth/login')
    })
})

router.get("/home", authControl, async (req, res) => {
    const lobbyData = await Lobby.find({}).lean()
    res.render('home', {
      pageTitle: "Contact Application | HOME",
      isHome: true,
      error: req.flash("error"),
      lobbyData: lobbyData
    })
})

router.post('/home', authControl, async (request,response)=>{

    await Object.values(request.body).map(value => {
        if(value === null || value === undefined || value === ""){
            request.flash("error","please enter all form field")
            response.redirect("/auth/home")
        }
    })

    const todo = new Lobby({
       lobby: request.body.lobby,
       lobby_owner: request.session.user.photo
    })

    await todo.save()
    response.redirect('/auth/home')
})

router.post('/delete', authControl, async (request,response)=>{
    await Lobby.findByIdAndDelete(request.body.id)
    
    response.redirect('/auth/home')
})

module.exports = router