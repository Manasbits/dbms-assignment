import { updateDefaultMealPlan } from '@/backend/services/mealPlanService';

export async function POST(request) {
    try {
        const body = await request.json();
        const { plan, preference } = body;

        if (!plan || !preference) {
            return Response.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        updateDefaultMealPlan(preference, plan);
        return Response.json({ message: 'Meal plan updated successfully' });
    } catch (error) {
        console.error('Error updating meal plan:', error);
        return Response.json({ error: 'Failed to update meal plan' }, { status: 500 });
    }
}