// verify the session
module.exports = (req, res, next) => {
    if (req.session.isadmin) {
        next();
    } else {
        return res.status(401).json({ message: "NodeJS: Authentication failed" });
    }
};
