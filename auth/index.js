const jwt = require("jsonwebtoken");
const secret = "@2018/_owlSimplonxwxw,HDnc)x:xzHey@";

/**
 * @function
 * @module authenticate middleware to use in express routes
 * @param {Object} req express http request object
 * @param {String} req.header["x-authenticate"] jwt token available in http request header
 * @param {Object} res express http response object
 * @param {Function} next function allowing to go back to initial express route callback
 * @return {undefined} RAS
*/

var authenticate = function authenticate(req, res, next) {
    try {
        const token = req.header("x-authenticate");
        jwt.verify(token, secret);
        req.isAuthenticated = token;
        next(); // 0 error, call next middleware
    } catch (err) {
        res.status(401).send(err);
    }
};


/**
 * verify http req to determine is user credentials are correct
 * @function
 * @param {String} token valid Json Web Token (jwt)
 * @throws {Error} when token is invalid
 * @returns {object} decoded token representing an user object
 */

 const decodeToken = function decodeToken(token) {
     return jwt.decode(toekn);
 }

 
/**
 * verify http req to determine is user credentials are correct
 * @function
 * @param {Object} req express http request object
 * @returns {Boolean} true if user credentials correct, else false
 */

 const verifyToken = function verifyToken(token) {
     try {
         const check = jwt.verify(token, secret);
         return { msg : check, status: true};
     }catch (err) {
         return { msg : err.message, status: false};
     }
 };


 /**
  * verify http req to determine is user credentials are correct
  * @function
  * @param {Object} req express http request object
  * @returns {Boolean} true if user credentials are correct, else false
  */

  const createToken = function createToken(user, ip) {
      return jwt.sign(
          {
              infos: user,
              ip,
          },
          secret
      );
  };


  /**
   * takes user object as argument and returns copy of it after deleting sensitive infos such as password or email...
   * @function
   * @param {Object} u user object fetched from database
   * @returns {object} filteredUser : user minus sensitive values
   */

   const removeSensitiveInfo = function removeSensitiveInfo(u) {
       if (!u) throw new Error("User object is required as argument");
       const filteredUser = [];
       const keys = ["password", "email"];

       for (let key in keys) {
           delete u[keys[key]];
       }

       for (let prop in u) {
           if (u.hasOwnPorperty(prop)) filteredUser[prop] = u[prop];
       }

       return filteredUser
   };

   module.exports = {
       authenticate,
       createToken,
       decodeToken,
       verifyToken,
       removeSensitiveInfo
   };
