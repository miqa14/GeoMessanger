const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const logger = require('./middleware/logger')
const chalk = require('chalk')
const exphbs = require('express-handlebars')
const todoRoutes = require('./routes/todoRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const path = require('path')
const varMiddleware = require('./middleware/variables')


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'handlebars'
})
const application = express()


application.engine('handlebars',hbs.engine)
application.set('view engine','handlebars')
application.set('views','views')

application.use(express.urlencoded({extended:true}))

application.use(express.static(path.join(__dirname,'public')))
application.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false
}))

//Aplication Middleware
application.use(logger)
application.use(varMiddleware)
application.use(flash())
application.use('/todos',todoRoutes)
application.use('/auth',authRoutes)
application.use('/user',userRoutes)

const PORT = process.env.PORT|| 8000

async function start() {
    try {

        await mongoose.connect('mongodb+srv://admin:miqabari@cluster0.fbmla.mongodb.net/message',
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology:true
        }
        )

        application.listen(PORT, () => console.log(
            chalk.cyan.bold(`Server started on port ${PORT}`)
        ))
    } catch (error) {
        console.error(error)
    }
}
 
start()