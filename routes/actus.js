const router = new require("express").Router();
const ActuModel = require("../models/Actu");

//* ****VOIR TOUTES LES ACTUS***** */
router.get("/", async (req, res, next) => { // requête asynchrone
    try {
        const actus = await ActuModel.find()
        res.json(actus);
    } catch (err) {
         next(err)
    }
});

//* ****VOIR UNE ACTU***** */
router.get("/:id", async (req, res, next) => {
    try {
        const actu = await ActuModel.findById(req.params.id)
        res.json(actu);
    } catch (err) {
        next(err);
    }
});

//* ****POSTER UNE ACTU***** */
router.post("/", async (req, res, next) => {
    try {
        const newActu = await ActuModel.create(req.body);
        res.json(newActu);
    } catch (err) {
        next(err);
    }
});

//* ****SUPPRIMER UNE ACTU***** */
router.delete("/:id", async (req, res, next) => {
    try {
        const deleteActu = await ActuModel.findByIdAndDelete(req.params.id);
        res.json(deleteActu);
    } catch (err) {
        next(err)
    }
});

//* ****MODIFIER UNE ACTU**** */
router.patch("/:id", async (req, res, next) => {
    try {
        const updateActu = await ActuModel.findByIdAndUpdate(req.params.id,
            req.body,
            { new : true }
            );
            res.json(updateActu)
    } catch(err) {
        next(err);
    }
});

//* ****EXPORT***** */
module.exports = router;