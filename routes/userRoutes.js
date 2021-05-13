const { Router, request, response } = require('express')
const User = require('../models/UserModel')
const Todo = require('../models/TodoModel')
const router = Router()
const authControl = require('../middleware/authControl')

router.get('/update',authControl, async (request,response) =>{

    response.render('update_user',{
        pageTitle: 'Todo application | UPDATE USER',
        isUpdateUser: true,
        error: request.flash("error"),
        info: request.flash("info"),
    })
})

router.post('/update',authControl, async (request,response) =>{
    await Object.values(request.body).map(value => {
        if(value === null || value === undefined || value === ""){
            request.flash("error","please enter all form field")
            response.redirect("/user/update")
        }
    })

    User
        .findByIdAndUpdate(request.session.user._id, request.body,{
            new: true,
            runValidators: true
        })
        .then((document) =>{

                request.session.user = document
                response.redirect('/user/update')
            
        })
        .catch(()=>{
            request.flash("error","Something went rong")
            response.redirect("/user/update")
        })
})
module.exports = router