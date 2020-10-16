const router = new require("express").Router();
const ActuModel = require("../models/Actu");

//* ****SEE ALL ACTUS***** */
router.get("/", async (req, res, next) => {
    try {
        const actus = await ActuModel.find()
        res.json(actus);
    } catch (err) {
         next(err)
    }
});

//* ****SEE ONE ACTU***** */
router.get("/:id", async (req, res, next) => {
    try {
        const actu = await ActuModel.findById(req.params.id)
        res.json(actu);
    } catch (err) {
        next(err);
    }
});

//* ****POST ONE ACTU***** */
router.post("/", async (req, res, next) => {
    try {
        const newActu = await ActuModel.create(req.body);
        res.json(newActu);
    } catch (err) {
        next(err);
    }
});

//* ****DELETE ONE ACTU***** */
router.delete("/:id", async (req, res, next) => {
    try {
        const deleteActu = await ActuModel.findByIdAndDelete(req.params.id);
        res.json(deleteActu);
    } catch (err) {
        next(err)
    }
});

//* ****UPDATE ONE ACTU**** */
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