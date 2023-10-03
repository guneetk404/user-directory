const jwt = require("jsonwebtoken")
const jwtAuth = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(402).send("bhag jaa")
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).send("sorry bhai");
    }

}


module.exports = jwtAuth;