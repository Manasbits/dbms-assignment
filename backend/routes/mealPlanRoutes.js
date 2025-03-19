import express from 'express';
import { mealPlanController } from '../controllers/mealPlanController';

const router = express.Router();

router.get('/default', mealPlanController.getDefaultMealPlan);
router.get('/alternatives', mealPlanController.getAlternatives);
router.post('/reset', mealPlanController.resetPlan);

export default router;