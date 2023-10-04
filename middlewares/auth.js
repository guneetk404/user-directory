const jwt = require("jsonwebtoken")
const jwtAuth = (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(token){
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if (!user ) {
                return res.status(402).send("User not logged in")
            }
            req.user = user;
            next();
        }else
        {
            return res.status(402).json("User not logged in - not found")
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).send("Internal Server Error 1");
    }

}


module.exports = jwtAuth;