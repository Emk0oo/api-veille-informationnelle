const express = require("express");
const router = express.Router();
const subscriptionsController = require("../controllers/subscriptions.controller");

router.get("/", subscriptionsController.getAll);
router.get("/user/:userId", subscriptionsController.getByUserId);
router.post("/", subscriptionsController.create);
// Si vous avez besoin de la méthode updateById, vous devrez l'ajouter au contrôleur
// router.put("/:id", subscriptionsController.updateById);
// Vous avez delete mais pas deleteById, donc adaptez cette route si nécessaire
// router.delete("/:id", subscriptionsController.deleteById);
// Peut-être avez-vous besoin de router.delete avec un corps de requête au lieu d'un paramètre d'URL
router.delete("/", subscriptionsController.delete);

module.exports = router;