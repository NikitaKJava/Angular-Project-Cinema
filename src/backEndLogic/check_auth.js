// verify the session
module.exports = (req, res, next) => {
	if (req.session.isAuth) {
		next();
	} else {
		return res.status(401).json({ message: "Authentication failed" });
	}
};
