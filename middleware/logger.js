const moment = require('moment')
const chalk = require('chalk')

const logger = (request, response, next) =>{
    console.log(chalk.greenBright.bold(
        `Request: ${request.protocol}://${request.get('host')}${request.originalUrl}: ${moment().format()}`
    ))
    
    

    next()
}

module.exports = logger