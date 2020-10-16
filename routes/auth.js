const router = new require("express").Router();
const bcrypt = require("bcrypt"); // library to encrypt password
const userModel = require("./../models/User");
const auth = require("./../auth") // library custom to manage Json Web Token (JWT)
const uploader = require("./../config/cloudinary");

router.get("/signout", (req, res) => {
    const x = req.session.destroy(); // invalidate token
    res.json(x);
});

router.get("/get-user-by-token", (req, res) => {
    try {
        const user = auth.decodeToken(req.header("x-authenticate"));
        const userId = user.infos_id;
        console.log("should be user", user);
        res.redirect("/users/" + userId);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

router.post("/signin", async (req, res, next) => {
    const userInfos = req.body; // check mail and password are entered
    if (!userInfos.email || !userInfos.password) {
        //never trust user input
        res.status(401).json({
            msg: "Identifiants incorrects", // return warning to client
            level: "errror",
        });
    }
 // si oui : vérifier que mail et mdp correspondent en bdd
  // 1 - récupérer l'utilisateur avec le mail fourni
    userModel
        .findOne({
            email: userInfos.email
        })
        .then((user) => {
            if (!user) {
                // null vaut si pas d'user trouvé pour ce mail
                //retourner une erreur au client
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error",
                });
            }

            // si oui comparer le mdp crypté sotcké en bdd avec la chaine en clair envoyée depuis le form
            const checkPassword = bcrypt.compareSync(
                userInfos.password, // password provenant du form "txt plein"
                user.password // password stocké en bdd (encrypté)
            ); // checkPasswor vaut true || false

            // si le mdp est incorrect : retourner message error sur signin
            if (checkPassword === false) {
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error",
                });
            }

            // si oui : stocker les infos de l'user en session pour lui permettre de naviguer jusqu'au signout
            const {
                _doc: clone
            } = {
                ...user
            }; // clone user
            delete clone.password; // par sécurité, delete mdp du clone (pas besoin de le stocker ailleurs qu'en bdd)
            req.session.currentUser = clone; // inscrit le clone dans la session (pr maintenant 1 état de connexion)

            const token = auth.createToken(user, req.ip); // createToken retourne un jeton (token) crée avec JWT

            return res
                .header("x-authenticate", token) // renvoie le token au client dans l'entête de la réponse pour authentification
                .status(200)
                .send({
                    user: clone,
                    token,
                    msg: "Connecté !",
                    level: "success"
                });
        })
        .catch(next);
});



/**
 * @see : https://www.youtube.com/watch?v=O6cmuiTBZVs
 */
router.post("/signup", uploader.single("avatar"), async (req, res, next) => {
    const user = req.body;
  
    if (req.file) user.avatar = req.file.path; // on associe l'image stockée sur cloudinary à l'user à insérer en base de données
  
    if (!user.password || !user.email) {
      return res.status(422).json({
        msg: "Merci de remplir tous les champs requis.",
        level: "warning",
      });
    } else {
      try {
        const previousUser = await userModel.findOne({ email: user.email }, { pseudo: user.pseudo });
        console.log(previousUser);
        if (previousUser) {
          return res.status(422).json({
            msg: "Désolé, cet email ou ce pseudo ne sont pas disponible !",
            level: "warning",
          });
        }
  
        // si le programme est lu jusqu'ici, on converti le mot de passe en chaîne cryptée
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        // console.log("password crypté >>>", hashed);
        user.password = hashed; // on remplace le mot de passe "en clair" par sa version cryptée
  
        // finalement on insère le nouvel utilisateur en base de données
        await userModel.create(user);
        return res.status(200).json({ msg: "signed up !", level: "success" });
      } catch (err) {
        next(err);
      }
    }
  });

module.exports = router;