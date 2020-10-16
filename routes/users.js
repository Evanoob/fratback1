//* ****IMPORT***** */
const router = new require("express").Router();
const UserModel = require("../models/User");
const auth = require("./../auth");
// const auth = require("./../auth/index");
const bcrypt = require("bcrypt");


//* ****SEE ALL USERS***** */
router.get("/", async (req, res, next) => {
    try {
        const users = await UserModel.find();
        // .populate("pole");
        res.json(users);
    } catch (err) {
        next(err);
    }
});

//* ****SEE ONE USER***** */
router.get("/:id", async (req, res, next) => {
   try {
        const user = await UserModel.findById(req.params.id);
    //    .populate("pole");
        res.json(user);
    } catch (err) {
        next(err);
    }
});

//* ****POST ONE USER***** */
router.post("/", async (req, res, next) => {
    try {
        const newUser = await UserModel.create(req.body);
        res.json(newUser);
    } catch (err) {
        next(err);
    }
});

//* ****DELETE ONE USER***** */
router.delete("/:id", async (req, res, next) => {
    try {
        const deleteUser = await UserModel.findByIdAndDelete(req.params.id);
        res.json(deleteUser);
    } catch (err) {
        next(err);
    }
});

//* ****UPDATE ONE USER***** */
router.patch("/:id", async (req, res, next) => {
    try {
      const updateUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      res.json(updateUser);
    } catch (err) {
      next(err)
    }
  });

  router.patch("/password/:id", auth.authenticate, async (req, res, next) => {
    var user = {
      ...req.body
    };
    try {
      const newPassword = await bcrypt.hash(user.password, 10);
      user.password = newPassword;
      console.log(user.password)
      const updateUser = await UserModel.findByIdAndUpdate(req.params.id, user, {
        new: true
      }); //pour récuperer le doc mis à jour
      res.json(updateUser);
    } catch (err) {
      next(err)
      
    }
  });

//* ****EXPORT***** */
module.exports = router;