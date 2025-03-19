import { getAlternativeOptions } from '@/backend/services/mealPlanService';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const foodType = searchParams.get('foodType');
    const currentFood = searchParams.get('currentFood');
    const preference = searchParams.get('preference');

    console.log('API received request:', { foodType, currentFood, preference });

    if (!foodType || !currentFood || !preference) {
        console.error('Missing parameters:', { foodType, currentFood, preference });
        return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const alternatives = getAlternativeOptions(foodType, currentFood, preference);
        console.log('API sending response:', alternatives);
        return Response.json(alternatives);
    } catch (error) {
        console.error('Error getting alternatives:', error);
        return Response.json({ error: 'Failed to get alternatives' }, { status: 500 });
    }
}