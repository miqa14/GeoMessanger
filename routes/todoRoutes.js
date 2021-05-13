const { Router, request, response } = require('express')
const logger = require('../middleware/logger')
const Todo = require('../models/TodoModel')
const router = Router()
const authControl = require('../middleware/authControl')
const Lobby = require('../models/lobbyModel')

router.get('/:id', authControl, async(request,response) =>{
    const todoData = await Todo.find({lobbyId: request.params.id}).lean()
    const product = await Lobby.findById(request.params.id).lean()

    response.render('Todos',{
        pageTitle: 'Todo application | WELCOME',
        isTodos: true,
        error: request.flash("error"),
        todoData: todoData,
        product: product
    })
})



router.post('/:id', authControl, async (request,response)=>{

    await Object.values(request.body).map(value => {
        if(value === null || value === undefined || value === ""){
            request.flash("error","please enter all form field")
            response.redirect("/todos")
        }
    })

    const todo = new Todo({
        msg: request.body.msg,
        MessageOwner: request.session.user.user_name,
        photo: request.session.user.photo,
        lobbyId: request.params.id
    })

    await todo.save()
    response.redirect(`/todos/${request.params.id}`)
})



module.exports = router