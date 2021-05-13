

module.exports = function(request,response,next) {
    response.locals.isAuth = request.session.isAuthenticated
    response.locals.user = request.session.user
    next()
}