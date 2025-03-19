import { carbOptions, fatOptions, protienOptions, defaultVegPlan, defaultNonVegPlan, updateDefaultPlan } from '@/utils/mocks';

export const generateDefaultMealPlan = (preference) => {
    // Check if default plan exists
    if (preference === 'Vegetarian' && defaultVegPlan) {
        return defaultVegPlan;
    }
    if (preference === 'Non-Vegetarian' && defaultNonVegPlan) {
        return defaultNonVegPlan;
    }

    // Generate new plan if no default exists
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealPlan = {};
    const usedFoods = new Set();

    // Filter foods based on preference
    const filteredCarbs = carbOptions.filter(food => {
        if (preference === 'Vegetarian') {
            return food['Veg/NonVeg'] === 'Veg';
        }
        return true;
    });

    const filteredProteins = protienOptions.filter(food => {
        if (preference === 'Vegetarian') {
            return food['Veg/NonVeg'] === 'Veg';
        }
        // For non-veg, prioritize non-veg proteins but include veg options
        return true;
    });

    const filteredFats = fatOptions.filter(food => {
        if (preference === 'Vegetarian') {
            return food['Veg/NonVeg'] === 'Veg';
        }
        return true;
    });

    const selectFoodsForMeal = (mealType, count, dayIndex) => {
        const foods = [];
        const usedCategories = new Set();

        const getFoodByType = (type, meal) => {
            const options = type === 'carb' ? filteredCarbs :
                          type === 'protein' ? filteredProteins :
                          filteredFats;
            
            // Find food that hasn't been used in this meal type across days
            return options.find(food => 
                (food['Meal 1'] === meal || food['Meal 2'] === meal) &&
                !usedCategories.has(food.Category) &&
                !usedFoods.has(`${food.Food}-${mealType}`)
            );
        };

        // Add carb
        const carb = getFoodByType('carb', mealType);
        if (carb) {
            foods.push(carb.Food);
            usedCategories.add(carb.Category);
            usedFoods.add(`${carb.Food}-${mealType}`);
        }

        // Add protein with non-veg priority
        if (count > 1) {
            let protein;
            if (preference === 'Non-Vegetarian') {
                protein = filteredProteins.find(food => 
                    food['Veg/NonVeg'] === 'Non-Veg' &&
                    (food['Meal 1'] === mealType || food['Meal 2'] === mealType) &&
                    !usedCategories.has(food.Category) &&
                    !usedFoods.has(`${food.Food}-${mealType}`)
                );
            }
            if (!protein) {
                protein = getFoodByType('protein', mealType);
            }
            if (protein) {
                foods.push(protein.Food);
                usedCategories.add(protein.Category);
                usedFoods.add(`${protein.Food}-${mealType}`);
            }
        }

        // Add fat
        if (count > 2) {
            const fat = getFoodByType('fat', mealType);
            if (fat) {
                foods.push(fat.Food);
                usedCategories.add(fat.Category);
                usedFoods.add(`${fat.Food}-${mealType}`);
            }
        }

        // Fill remaining slots with unused foods
        while (foods.length < count) {
            const remainingFood = [...filteredCarbs, ...filteredProteins, ...filteredFats]
                .find(food => 
                    (food['Meal 1'] === mealType || food['Meal 2'] === mealType) &&
                    !usedCategories.has(food.Category) &&
                    !usedFoods.has(`${food.Food}-${mealType}`)
                );
            
            if (remainingFood) {
                foods.push(remainingFood.Food);
                usedCategories.add(remainingFood.Category);
                usedFoods.add(`${remainingFood.Food}-${mealType}`);
            } else {
                // If no unused foods available, use any valid food
                const anyFood = [...filteredCarbs, ...filteredProteins, ...filteredFats]
                    .find(food => 
                        (food['Meal 1'] === mealType || food['Meal 2'] === mealType) &&
                        !usedCategories.has(food.Category)
                    );
                if (anyFood) {
                    foods.push(anyFood.Food);
                    usedCategories.add(anyFood.Category);
                }
                break;
            }
        }

        return foods.join(', ');
    };

    days.forEach((day, index) => {
        mealPlan[day] = {
            breakfast: selectFoodsForMeal('Breakfast', 3, index),
            lunch: selectFoodsForMeal('Lunch', 4, index),
            dinner: selectFoodsForMeal('Dinner', 4, index),
            snack: selectFoodsForMeal('Snack', 1, index)
        };
    });

    // Store the generated plan
    updateDefaultPlan(preference, mealPlan);
    return mealPlan;
};

export const updateDefaultMealPlan = (preference, newPlan) => {
    updateDefaultPlan(preference, newPlan);
};

export const getAlternativeOptions = (foodType, currentFood, preference) => {
    console.log('Getting alternatives for:', { foodType, currentFood, preference });
    
    let sourceArray;
    switch (foodType) {
        case 'carb':
            sourceArray = carbOptions;
            break;
        case 'protein':
            sourceArray = protienOptions;
            break;
        case 'fat':
            sourceArray = fatOptions;
            break;
        default:
            return [];
    }

    // Find current food's properties
    const currentItem = sourceArray.find(item => item.Food === currentFood);
    if (!currentItem) {
        console.log('Current food not found:', currentFood);
        return [];
    }

    console.log('Current item found:', currentItem);
    console.log('Available options:', sourceArray);

    // Filter alternatives with less strict conditions
    const alternatives = sourceArray.filter(item => {
        const differentFood = item.Food !== currentFood;
        const matchesPreference = preference === 'Non-Vegetarian' ? true : item['Veg/NonVeg'] === 'Veg';
        const matchesCategory = item.Category === currentItem.Category;
        const matchesMealTiming = (
            item['Meal 1'] === currentItem['Meal 1'] ||
            item['Meal 2'] === currentItem['Meal 1'] ||
            item['Meal 1'] === currentItem['Meal 2'] ||
            item['Meal 2'] === currentItem['Meal 2']
        );

        // Debug log for each item
        console.log('Checking item:', item.Food, {
            differentFood,
            matchesPreference,
            matchesCategory,
            matchesMealTiming,
            itemCategory: item.Category,
            currentCategory: currentItem.Category,
            itemMeals: [item['Meal 1'], item['Meal 2']],
            currentMeals: [currentItem['Meal 1'], currentItem['Meal 2']]
        });

        return differentFood && matchesPreference && (matchesCategory || matchesMealTiming);
    });

    console.log('Found alternatives:', alternatives);

    return alternatives.map(item => ({
        food: item.Food,
        calories: item.Calories
    }));
};