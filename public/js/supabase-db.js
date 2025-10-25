// Supabase Database Integration
class SupabaseDB {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Check if Supabase is enabled and configured
            const supabaseUrl = getConfig('api.supabase.url');
            const supabaseKey = getConfig('api.supabase.anonKey');
            const isEnabled = getConfig('api.supabase.enabled');

            if (!isEnabled || !supabaseUrl || !supabaseKey || 
                supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || 
                supabaseKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
                
                if (getConfig('debug.enabled')) {
                    console.log('Supabase not configured or disabled');
                }
                return;
            }

            // Initialize Supabase client
            if (typeof window.supabase !== 'undefined') {
                this.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
                this.isInitialized = true;
                
                if (getConfig('debug.enabled')) {
                    console.log('Supabase initialized successfully');
                }
            } else {
                console.error('Supabase library not loaded. Please include the Supabase CDN script.');
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
        }
    }

    isReady() {
        return this.isInitialized && this.supabase !== null;
    }

    // Check if message is fitness/nutrition related
    isFitnessRelated(message) {
        const fitnessKeywords = [
            // Exercise & Training
            'exercise', 'workout', 'training', 'fitness', 'gym', 'muscle', 'strength', 'cardio', 'lift', 'rep', 'set',
            'push', 'pull', 'squat', 'deadlift', 'bench', 'run', 'jog', 'walk', 'swim', 'bike', 'cycling',
            'climb', 'climbing', 'rock', 'wall', 'bouldering', 'rappelling', 'belay',
            // Body parts
            'chest', 'back', 'legs', 'arms', 'shoulders', 'abs', 'core', 'biceps', 'triceps', 'glutes', 'calves',
            // Nutrition
            'nutrition', 'diet', 'food', 'calories', 'protein', 'carbs', 'fat', 'fiber', 'vitamins', 'minerals',
            'meal', 'eat', 'drink', 'supplement', 'weight', 'lose', 'gain', 'bulk', 'cut', 'macro', 'micro',
            // Wellness
            'health', 'wellness', 'recovery', 'sleep', 'hydration', 'stretch', 'flexibility', 'injury', 'form',
            // Goals
            'goal', 'target', 'plan', 'program', 'routine', 'schedule', 'progress', 'result', 'transform',
            // Gym & Equipment
            'facility', 'center', 'machine', 'equipment', 'treadmill', 'elliptical', 'barbell', 'dumbbell',
            'location', 'hours', 'access', 'campus', 'available', 'condition', 'brand', 'model',
            'gyms', 'facilities', 'centers', 'machines', 'equipments', // plural forms
            // Dining & Food Locations
            'dining', 'cafeteria', 'restaurant', 'food court', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast',
            'snack', 'where to eat', 'food options', 'menu', 'kitchen', 'canteen', 'eatery', 'bistro', 'grill',
            'deli', 'bakery', 'pizza', 'salad bar', 'buffet', 'takeout', 'delivery', 'grab and go'
        ];

        const messageLower = message.toLowerCase();
        return fitnessKeywords.some(keyword => messageLower.includes(keyword));
    }

    // Query data for AI context
    async queryForContext(userMessage) {
        if (!this.isReady()) {
            console.warn('Supabase not ready for queryForContext');
            return null;
        }

        console.log('🔍 Querying database for context with message:', userMessage);
        console.log('🔍 DATABASE QUERY CALLED - THIS SHOULD APPEAR FOR EVERY MESSAGE!');

        try {
            // First check if the message is fitness-related
            if (!this.isFitnessRelated(userMessage)) {
                console.log('❌ Message not fitness-related, returning redirect');
                return {
                    type: 'redirect',
                    message: 'off_topic_query'
                };
            }

            console.log('✅ Message is fitness-related, proceeding with database query');

            // Extract keywords and search database
            const keywords = this.extractKeywords(userMessage);
            console.log('📝 Extracted keywords:', keywords);
            console.log('📝 Original message:', userMessage);
            console.log('🧗 CLIMBING KEYWORDS CHECK:', keywords.filter(word => ['climb', 'climbing', 'wall', 'rock', 'bouldering'].includes(word.toLowerCase())));
            let contextData = [];

            // Search exercises table
            if (keywords.some(word => ['exercise', 'workout', 'training', 'fitness', 'muscle', 'strength', 'cardio'].includes(word.toLowerCase()))) {
                console.log('🏋️ Searching exercises table...');
                const { data: exercises } = await this.supabase
                    .from('exercises')
                    .select('*')
                    .or(keywords.map(keyword => `name.ilike.%${keyword}%`).join(','))
                    .limit(5);
                
                console.log('🏋️ Exercises found:', exercises?.length || 0);
                if (exercises?.length > 0) {
                    console.log('🏋️ Exercise data:', exercises);
                    contextData.push({
                        type: 'exercises',
                        data: exercises
                    });
                }
            }

            // Search nutrition table
            if (keywords.some(word => ['nutrition', 'diet', 'food', 'calories', 'protein', 'carbs', 'fat', 'meal', 'eat'].includes(word.toLowerCase()))) {
                const { data: nutrition } = await this.supabase
                    .from('nutrition')
                    .select('*')
                    .or(keywords.map(keyword => `food_name.ilike.%${keyword}%,category.ilike.%${keyword}%`).join(','))
                    .limit(5);
                
                if (nutrition?.length > 0) {
                    contextData.push({
                        type: 'nutrition',
                        data: nutrition
                    });
                }
            }

            // Search college gyms table
            if (keywords.some(word => ['gym', 'gyms', 'facility', 'facilities', 'center', 'centers', 'location', 'campus', 'hours', 'access', 'climb', 'climbing', 'wall', 'rock', 'bouldering'].includes(word.toLowerCase()))) {
                console.log('🏢 Searching college gyms table...');
                // Create smart search terms (handle singular/plural)
                const searchTerms = [];
                keywords.forEach(keyword => {
                    const word = keyword.toLowerCase();
                    if (word === 'gyms') searchTerms.push('gym');
                    else if (word === 'facilities') searchTerms.push('facility');
                    else if (word === 'centers') searchTerms.push('center');
                    else searchTerms.push(word);
                });
                
                // Add common gym-related terms
                searchTerms.push('fitness', 'recreation', 'training');
                
                // Add climbing-specific terms if climbing keywords detected
                if (keywords.some(word => ['climb', 'climbing', 'wall', 'rock', 'bouldering'].includes(word.toLowerCase()))) {
                    searchTerms.push('climb', 'climbing', 'wall', 'rock', 'bouldering', 'arc');
                }
                
                const { data: gyms } = await this.supabase
                    .from('college_gyms')
                    .select('*')
                    .or(searchTerms.map(term => `name.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`).join(','))
                    .limit(5);
                
                console.log('🏢 Gyms found:', gyms?.length || 0);
                if (gyms?.length > 0) {
                    console.log('🏢 Gym data:', gyms);
                    console.log('🏢 DETAILED GYM INFO:', gyms.map(gym => ({
                        name: gym.name,
                        amenities: gym.amenities,
                        description: gym.description
                    })));
                    contextData.push({
                        type: 'college_gyms',
                        data: gyms
                    });
                }
            }

            // Search gym machines table
            if (keywords.some(word => ['machine', 'equipment', 'treadmill', 'elliptical', 'barbell', 'dumbbell', 'bench', 'rack', 'available', 'condition'].includes(word.toLowerCase()))) {
                const { data: machines } = await this.supabase
                    .from('gym_machines')
                    .select('*, college_gyms(name, location)')
                    .or(keywords.map(keyword => `name.ilike.%${keyword}%,description.ilike.%${keyword}%,machine_type.ilike.%${keyword}%,brand.ilike.%${keyword}%`).join(','))
                    .limit(8);
                
                if (machines?.length > 0) {
                    contextData.push({
                        type: 'gym_machines',
                        data: machines
                    });
                }
            }

            // Search dining locations table
            const diningKeywords = ['dining', 'cafeteria', 'restaurant', 'food', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'snack', 'eat', 'menu', 'kitchen', 'canteen', 'eatery', 'bistro', 'grill', 'deli', 'bakery', 'pizza', 'salad', 'buffet', 'takeout', 'delivery', 'campus', 'locations', 'location', 'burrito', 'burritos', 'taco', 'tacos', 'sandwich', 'sandwiches', 'wrap', 'wraps', 'bowl', 'bowls', 'soup', 'soups', 'bread', 'cornbread', 'muffin', 'muffins', 'bagel', 'bagels', 'pasta', 'noodles', 'rice', 'chicken', 'beef', 'pork', 'fish', 'fries', 'chips', 'cookies', 'cake', 'dessert', 'desserts', 'ice', 'cream', 'milkshake', 'milkshakes', 'smoothie', 'smoothies', 'juice', 'soda', 'drink', 'drinks', 'tea', 'hot', 'cold', 'fresh', 'fried', 'grilled', 'baked', 'steamed'];
            
            if (keywords.some(word => diningKeywords.includes(word.toLowerCase()))) {
                console.log('🍽️ Searching dining locations table...');
                console.log('🍽️ Keywords that triggered dining search:', keywords.filter(word => diningKeywords.includes(word.toLowerCase())));
                console.log('🍽️ All extracted keywords:', keywords);
                
                try {
                    console.log('🍽️ Searching for keywords:', keywords);
                    
                    let diningLocations = [];
                    
                    // Search by location/restaurant name first
                    for (const keyword of keywords) {
                        const { data: nameResults } = await this.supabase
                            .from('dining_locations')
                            .select('*')
                            .or(`name.ilike.%${keyword}%,location.ilike.%${keyword}%,type.ilike.%${keyword}%`);
                        
                        if (nameResults && nameResults.length > 0) {
                            diningLocations = [...diningLocations, ...nameResults];
                        }
                    }
                    
                    console.log('🍽️ Found locations by name/location:', diningLocations.length);
                    
                    // ALSO search by food items in the food_available array
                    for (const keyword of keywords) {
                        console.log(`🍽️ Searching for food item: "${keyword}"`);
                        
                        try {
                            // Method 1: Search for exact match in array
                            const { data: foodResults, error: foodError } = await this.supabase
                                .from('dining_locations')
                                .select('*')
                                .contains('food_available', [keyword]);
                            
                            console.log(`🍽️ Method 1 (contains) for "${keyword}":`, foodResults?.length || 0, 'results');
                            if (foodError) console.log('🍽️ Method 1 error:', foodError);
                            
                            if (foodResults && foodResults.length > 0) {
                                console.log(`🍽️ ✅ Found ${foodResults.length} locations serving "${keyword}"`, foodResults.map(r => r.name));
                                diningLocations = [...diningLocations, ...foodResults];
                            } else {
                                // Method 2: Try case-insensitive partial match
                                console.log(`🍽️ Trying case-insensitive search for "${keyword}"`);
                                const { data: allLocs } = await this.supabase
                                    .from('dining_locations')
                                    .select('*');
                                
                                const matchingLocs = allLocs?.filter(loc => 
                                    loc.food_available && loc.food_available.some(food => 
                                        food.toLowerCase().includes(keyword.toLowerCase())
                                    )
                                ) || [];
                                
                                console.log(`🍽️ Method 2 (case-insensitive) for "${keyword}":`, matchingLocs.length, 'results');
                                if (matchingLocs.length > 0) {
                                    console.log(`🍽️ ✅ Found locations with "${keyword}":`, matchingLocs.map(r => r.name));
                                    diningLocations = [...diningLocations, ...matchingLocs];
                                }
                            }
                        } catch (foodError) {
                            console.log(`🍽️ Error searching for "${keyword}":`, foodError);
                        }
                    }
                    
                    // Remove duplicates
                    diningLocations = diningLocations.filter((item, index, self) => 
                        index === self.findIndex(t => t.id === item.id)
                    );
                    
                    console.log('🍽️ Total unique locations found:', diningLocations.length);
                    
                    // If still no matches, get all locations for general context
                    if (diningLocations.length === 0) {
                        const { data: allLocations } = await this.supabase
                            .from('dining_locations')
                            .select('*')
                            .limit(10);
                        diningLocations = allLocations || [];
                        console.log('🍽️ No specific matches, showing all locations for context:', diningLocations.length);
                    }
                    
                    const error = null;
                    
                    console.log('🍽️ Supabase query error:', error);
                    console.log('🍽️ Dining locations found:', diningLocations?.length || 0);
                    console.log('🍽️ Raw dining location data:', diningLocations);
                    
                    if (error) {
                        console.error('🍽️ Database error:', error);
                    } else if (diningLocations?.length > 0) {
                        console.log('🍽️ ✅ ADDING DINING CONTEXT TO AI');
                        contextData.push({
                            type: 'dining_locations',
                            data: diningLocations
                        });
                    } else {
                        console.log('🍽️ ❌ No dining locations matched search criteria');
                    }
                } catch (queryError) {
                    console.error('🍽️ Exception during dining query:', queryError);
                }
            } else {
                console.log('🍽️ Dining keywords not found in:', keywords);
            }

            // Skip user profiles for now to avoid RLS issues
            // User profile functionality disabled temporarily

            return contextData.length > 0 ? contextData : null;

        } catch (error) {
            console.error('❌ Error querying Supabase:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return null;
        }
    }

    // Extract keywords from user message for database search
    extractKeywords(message) {
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'what', 'how', 'when', 'where', 'why', 'does', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'do', 'did', 'get', 'got', 'there', 'their', 'they', 'them', 'this', 'that', 'these', 'those'];
        
        return message
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word))
            .slice(0, 10); // Limit to 10 keywords
    }

    // Format context data for AI prompt
    formatContextForAI(contextData) {
        if (!contextData || contextData.length === 0) {
            return '';
        }

        // Handle redirect scenario
        if (contextData.type === 'redirect' && contextData.message === 'off_topic_query') {
            return '\n⚠️ OFF-TOPIC QUERY DETECTED: This question is not related to fitness, nutrition, or wellness. You MUST redirect the user to fitness topics using the redirect phrase.\n';
        }

        let contextText = '\n\n📊 RELEVANT DATABASE INFORMATION:\n';

        contextData.forEach(context => {
            switch (context.type) {
                case 'exercises':
                    contextText += '\nExercises:\n';
                    context.data.forEach(exercise => {
                        contextText += `- ${exercise.name}: ${exercise.description} (${exercise.muscle_group})\n`;
                    });
                    break;

                case 'nutrition':
                    contextText += '\nNutrition Information:\n';
                    context.data.forEach(item => {
                        contextText += `- ${item.food_name}: ${item.calories} calories, ${item.protein}g protein\n`;
                    });
                    break;

                case 'college_gyms':
                    contextText += '\nCollege Gyms:\n';
                    context.data.forEach(gym => {
                        contextText += `- ${gym.name}: ${gym.description}\n`;
                        contextText += `  Location: ${gym.location}`;
                        contextText += `\n  Hours: ${gym.hours_operation}\n`;
                        if (gym.amenities && gym.amenities.length > 0) {
                            contextText += `  Amenities: ${gym.amenities.join(', ')}\n`;
                        }
                    });
                    break;

                case 'gym_machines':
                    contextText += '\nGym Equipment:\n';
                    context.data.forEach(machine => {
                        contextText += `- ${machine.name}`;
                        if (machine.brand) contextText += ` (${machine.brand})`;
                        contextText += `\n  Type: ${machine.machine_type}`;
                        if (machine.muscle_groups && machine.muscle_groups.length > 0) {
                            contextText += ` | Targets: ${machine.muscle_groups.join(', ')}`;
                        }
                        contextText += `\n  Status: ${machine.availability_status} | Condition: ${machine.condition}`;
                        if (machine.quantity > 1) contextText += ` | Quantity: ${machine.quantity}`;
                        if (machine.college_gyms) {
                            contextText += `\n  Location: ${machine.college_gyms.name}`;
                        }
                        if (machine.description) contextText += `\n  ${machine.description}`;
                        contextText += '\n';
                    });
                    break;

                case 'dining_locations':
                    contextText += '\nDining Locations:\n';
                    context.data.forEach(location => {
                        contextText += `- ${location.name}`;
                        if (location.type) contextText += ` (${location.type})`;
                        contextText += `\n  Location: ${location.location}`;
                        if (location.food_available && location.food_available.length > 0) {
                            contextText += `\n  Available Food: ${location.food_available.join(', ')}`;
                        }
                        contextText += '\n';
                    });
                    break;

                case 'user_profile':
                    contextText += '\nUser Profile:\n';
                    const profile = context.data;
                    contextText += `- Goals: ${profile.fitness_goals}\n`;
                    contextText += `- Experience Level: ${profile.experience_level}\n`;
                    contextText += `- Preferences: ${profile.preferences}\n`;
                    break;
            }
        });

        contextText += '\nPlease use this information to provide more personalized and accurate responses.\n';
        return contextText;
    }

    // CRUD operations for your tables
    async addExercise(exerciseData) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('exercises')
                .insert([exerciseData])
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding exercise:', error);
            return null;
        }
    }

    async getUserProfile(userId) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    async updateUserProfile(userId, updates) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .update(updates)
                .eq('user_id', userId)
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            return null;
        }
    }

    // Gym-specific methods
    async getAllGyms() {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('college_gyms')
                .select('*')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching gyms:', error);
            return null;
        }
    }

    async getGymMachines(gymId) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('gym_machines')
                .select('*')
                .eq('gym_id', gymId)
                .order('machine_type', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching gym machines:', error);
            return null;
        }
    }

    async getMachinesByType(machineType) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('gym_machines')
                .select('*, college_gyms(name, location)')
                .eq('machine_type', machineType)
                .eq('availability_status', 'Available')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching machines by type:', error);
            return null;
        }
    }

    async searchMachinesByMuscleGroup(muscleGroup) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('gym_machines')
                .select('*, college_gyms(name, location)')
                .contains('muscle_groups', [muscleGroup])
                .eq('availability_status', 'Available')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching machines by muscle group:', error);
            return null;
        }
    }

    // Advanced search functionality
    async searchDatabase(query, tables = ['exercises', 'nutrition', 'college_gyms', 'gym_machines', 'dining_locations']) {
        if (!this.isReady()) {
            console.warn('🚫 searchDatabase: Database not ready');
            return [];
        }

        console.log(`🔍 searchDatabase: Searching for "${query}" in tables:`, tables);
        const results = [];
        
        for (const table of tables) {
            try {
                console.log(`🔍 Searching table: ${table}`);
                let searchQuery;
                
                // Customize search based on table
                switch (table) {
                    case 'exercises':
                        searchQuery = this.supabase.from(table)
                            .select('*')
                            .or(`name.ilike.%${query}%,description.ilike.%${query}%,muscle_group.ilike.%${query}%`);
                        break;
                    case 'nutrition':
                        searchQuery = this.supabase.from(table)
                            .select('*')
                            .or(`food_name.ilike.%${query}%,category.ilike.%${query}%`);
                        break;
                    case 'college_gyms':
                        searchQuery = this.supabase.from(table)
                            .select('*')
                            .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
                        break;
                    case 'gym_machines':
                        searchQuery = this.supabase.from(table)
                            .select('*, college_gyms(name, location)')
                            .or(`name.ilike.%${query}%,description.ilike.%${query}%,machine_type.ilike.%${query}%,brand.ilike.%${query}%`);
                        break;
                    case 'dining_locations':
                        searchQuery = this.supabase.from(table)
                            .select('*')
                            .or(`name.ilike.%${query}%,location.ilike.%${query}%,type.ilike.%${query}%,food_available.cs.{${query}}`);
                        break;
                    default:
                        searchQuery = this.supabase.from(table).select('*').textSearch('name', query);
                }

                const { data, error } = await searchQuery.limit(10);
                
                console.log(`📊 ${table} search result:`, { 
                    data: data, 
                    dataLength: data?.length || 0, 
                    error: error?.message || 'none',
                    dataType: typeof data,
                    isArray: Array.isArray(data)
                });
                
                if (error) {
                    console.error(`❌ Error in ${table}:`, error);
                } else if (data && Array.isArray(data) && data.length > 0) {
                    console.log(`✅ Found ${data.length} results in ${table}:`, data);
                    results.push({
                        table,
                        results: data
                    });
                } else {
                    console.log(`📭 No results found in ${table} - data:`, data, 'length:', data?.length);
                }
            } catch (error) {
                console.error(`❌ Exception searching ${table}:`, error);
            }
        }

        console.log(`🎯 searchDatabase final results:`, results);
        return results;
    }

    // Dining location-specific methods
    async getAllDiningLocations() {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('dining_locations')
                .select('*')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching dining locations:', error);
            return null;
        }
    }

    async getDiningLocationsByType(locationType) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('dining_locations')
                .select('*')
                .eq('type', locationType)
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching dining locations by type:', error);
            return null;
        }
    }

    async searchDiningByFood(foodItem) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('dining_locations')
                .select('*')
                .contains('food_available', [foodItem])
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching dining by food:', error);
            return null;
        }
    }

    async addDiningLocation(diningData) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await this.supabase
                .from('dining_locations')
                .insert([diningData])
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding dining location:', error);
            return null;
        }
    }

    // Health check
    async testConnection() {
        if (!this.isReady()) {
            return { status: 'error', message: 'Supabase not initialized' };
        }

        try {
            const { data, error } = await this.supabase
                .from('exercises')
                .select('count')
                .limit(1);

            if (error) throw error;
            
            return { status: 'ok', message: 'Connection successful' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
}

// Export for global use
window.SupabaseDB = SupabaseDB;