export let isloggedIn = function (req,res,next){
    if(req.user){
        // console.log(req.session)
        next()
    }else{
        res.status(401).send('Access Denied');
    }
}