

export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.redirect("/login");
      }
  
      const { role } = req.user;
      if (!allowedRoles.includes(role)) {
        return res.status(403).send("Access Denied");
      }
  
      next();
    };
  };