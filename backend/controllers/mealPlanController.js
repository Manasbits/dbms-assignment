import { generateDefaultMealPlan, getAlternativeOptions, resetMealPlan } from '../services/mealPlanService';

export const mealPlanController = {
    getDefaultMealPlan: (req, res) => {
        const { preference } = req.query;
        try {
            const mealPlan = generateDefaultMealPlan(preference);
            return res.status(200).json(mealPlan);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to generate meal plan' });
        }
    },

    getAlternatives: (req, res) => {
        const { foodType, currentFood, preference } = req.query;
        try {
            const alternatives = getAlternativeOptions(foodType, currentFood, preference);
            return res.status(200).json(alternatives);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to get alternatives' });
        }
    },

    resetPlan: (req, res) => {
        try {
            resetMealPlan();
            return res.status(200).json({ message: 'Meal plan reset successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to reset meal plan' });
        }
    }
};