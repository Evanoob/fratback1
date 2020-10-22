const router = new require("express").Router();
const bcrypt = require("bcrypt"); // librairie pour crypter le mot de passe
const userModel = require("./../models/User"); // on récupère le model User
const auth = require("./../auth") // Librairie custom pour gérer le JWT
const uploader = require("./../config/cloudinary"); // config de cloudinary pour pouvoir update des images plus tard

// deconnexion
router.get("/signout", (req, res) => {
    const x = req.session.destroy(); // invalide token on détruit la session
    res.json(x);
});

// récupérer l'utilisateur par son jwt
router.get("/get-user-by-token", (req, res) => {
    try {
        const user = auth.decodeToken(req.header("x-authenticate")); // on decode le token afin de l'authentifier dans x-authenticate dans le navigateur
        const userId = user.infos_id; // récupère les infos de l'utilisateur identifié
        console.log("should be user", user);
        res.redirect("/users/" + userId); // on redirige sur l'id de l'utilisateur dans la liste des utilisateurs
    } catch (err) { // sinon on attrape l'erreur
        res.status(500).json(err.message); // erreur 500 vient du serveur
    }
});

// connexion
router.post("/signin", async (req, res, next) => {
    const userInfos = req.body; 
    if (!userInfos.email || !userInfos.password) { // on vérifie que l'email et le mot de passe sont bien entrés
        //never trust user input
        res.status(401).json({ // sinon on retourne une erreur 401 qui dit que l'on doit s'identifier pour accéder
            msg: "Identifiants incorrects", // retourne une alerte au client
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
                userInfos.password, // mdp provenant du form "txt plein"
                user.password // mdp stocké en bdd (encrypté)
            ); // checkPassword vaut true || false

            // si le mdp est incorrect : retourner message error sur signin
            if (checkPassword === false) {
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error",
                });
            }

            // si oui : stocker les infos de l'user en session pour lui permettre de naviguer jusqu'au signout
            const {
                _doc: clone // on crée un clone de l'utilisateur
            } = {
                ...user
            }; // clone user
            delete clone.password; // par sécurité, on supprime le mdp du clone (pas besoin de le stocker ailleurs qu'en bdd)
            req.session.currentUser = clone; // inscrit le clone dans la session (pr maintenant 1 état de connexion)

            const token = auth.createToken(user, req.ip); // createToken retourne un jeton (token) crée avec JWT

            return res
                .header("x-authenticate", token) // renvoie le token au client dans l'entête de la réponse pour authentification
                .status(200) // status ok
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

 // inscription
router.post("/signup", uploader.single("avatar"), async (req, res, next) => {
    const user = req.body;
  
    if (req.file) user.avatar = req.file.path; // on associe l'image stockée sur cloudinary à l'utilisateur à insérer en base de données
  
    if (!user.password || !user.email) { // si pas de mail pas de mdp on retourne une erreur
      return res.status(422).json({ // requête comprise mais le serveur ne peut pas la réaliser
        msg: "Merci de remplir tous les champs requis.",
        level: "warning",
      });
    } else {
      try {
        const previousUser = await userModel.findOne({ email: user.email }, { pseudo: user.pseudo }); // on cherche si un utilisateur utilise déjà ce mail ou ce pseudo
        console.log(previousUser);
        if (previousUser) { // s'il y a un utilisateur qui a le même mail ou pseudo on lance une alerte
          return res.status(422).json({
            msg: "Désolé, cet email ou ce pseudo ne sont pas disponible !",
            level: "warning",
          });
        }
  
        // si le programme est lu jusqu'ici, on converti le mot de passe en chaîne cryptée
        const salt = bcrypt.genSaltSync(10); 
        const hashed = bcrypt.hashSync(user.password, salt); // on va hash le mdp et le passer au salage 10 fois
        // console.log("password crypté >>>", hashed);
        user.password = hashed; // on remplace le mot de passe "en clair" par sa version cryptée
  
        // finalement on insère le nouvel utilisateur en base de données
        await userModel.create(user);
        return res.status(200).json({ msg: "signed up !", level: "success" }); // requête réussie
      } catch (err) { // sinon on attrape l'erreur
        next(err);
      }
    }
  });

module.exports = router;