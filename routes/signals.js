const router = new require("express").Router();
const SignalModel = require("../models/Signal");

//* ****VOIR TS LES SIGNALEMENTS***** */
router.get("/", async(req, res, next) => {
    try {
        const signals = await SignalModel.find()
        .populate("id_sender");
        res.json(signals);
    } catch (err) {
        next(err);
    }
});

//* ****VOIR UN SIGNALEMENT***** */
router.get("/:id", async (req, res,next) => {
    try {
        const post = await SignalModel.findById(req.params.id)
        .populate("id_sender");
        res.json(post);
    } catch (err) {
        next(err);
    }
});

//* ****POSTER UN SIGNALEMENT***** */
router.post("/", async (req, res, next) => {
    try {
        const newSignal = await SignalModel.create(req.body);
        res.json(newSignal);
    } catch (err) {
        next(err);
    }
});

//* ****SUPPRIMER UN SIGNALEMENT***** */
router.delete("/:id", async (req, res, next) => {
    try {
        const deleteSignal = await SignalModel.findByIdAndDelete(req.params.id);
        res.json(deleteSignal);
    } catch (err) {
        next(err);
    }
});

//* ****MODIFIER UN SIGNALEMENT**** */
router.patch("/:id", async (req, res, next) => {
    try {
        const updateSignal = await SignalModel.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true }
            );
            res.json(updateSignal);
    } catch (err) {
        next(err);
    }
}); 

//* ****EXPORT***** */
module.exports = router;