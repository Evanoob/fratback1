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
        jwt.verify(token, secret); // vérifie si le token est bon
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
     return jwt.decode(token); // retourne le token décodé
 }

 
/**
 * verify http req to determine is user credentials are correct
 * @function
 * @param {Object} req express http request object
 * @returns {Boolean} true if user credentials correct, else false
 */

 const verifyToken = function verifyToken(token) {
     try {
         const check = jwt.verify(token, secret); //on vérifie le jwt 
         return { msg : check, status: true}; // true si c'est bon 
     }catch (err) {
         return { msg : err.message, status: false}; // sinon false on envoie 1 err
     }
 };


 /**
  * verify http req to determine is user credentials are correct
  * @function
  * @param {Object} req express http request object
  * @returns {Boolean} true if user credentials are correct, else false
  */

  const createToken = function createToken(user, ip) { // créer le token à part d'user et ip
      return jwt.sign( // on retourne les infos du jwt
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

   const removeSensitiveInfo = function removeSensitiveInfo(u) { // pour supprimer les infos sensibles
       if (!u) throw new Error("User object is required as argument");
       const filteredUser = []; // les infos filtrés de user
       const keys = ["password", "email"];

       for (let key in keys) {
           delete u[keys[key]];
       }

       for (let prop in u) {
           if (u.hasOwnPorperty(prop)) filteredUser[prop] = u[prop];
       }

       return filteredUser // on retourne les infos de user filtré
   };

   module.exports = {
       authenticate,
       createToken,
       decodeToken,
       verifyToken,
       removeSensitiveInfo
   };
