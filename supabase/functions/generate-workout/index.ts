import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WGER_API_TOKEN = '2cc59dab843249be079aa21f30944afb0383f496';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Fetching workout plans, user goals:', prompt);

    // Create a diverse set of workout templates
    const workoutTemplates = [
      {
        name: 'Full Body Strength',
        description: 'Compound exercises for overall strength',
        type: 'strength',
        exercises: [
          { name: 'Barbell Squats', sets: 4, reps: '8-10', notes: 'Focus on form and depth' },
          { name: 'Bench Press', sets: 4, reps: '8-12', notes: 'Control the negative' },
          { name: 'Deadlifts', sets: 3, reps: '6-8', notes: 'Keep back straight' },
          { name: 'Pull-ups', sets: 3, reps: '8-12', notes: 'Use assistance if needed' }
        ]
      },
      {
        name: 'HIIT Cardio',
        description: 'High-intensity interval training',
        type: 'cardio',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '30 seconds', notes: 'Maximum effort' },
          { name: 'Mountain Climbers', sets: 4, reps: '45 seconds', notes: 'Keep core tight' },
          { name: 'Jump Rope', sets: 4, reps: '1 minute', notes: 'Stay light on feet' },
          { name: 'Sprints', sets: 6, reps: '30 seconds', notes: '30 seconds rest between sets' }
        ]
      },
      {
        name: 'Upper Body Focus',
        description: 'Targeting chest, back, and arms',
        type: 'strength',
        exercises: [
          { name: 'Dumbbell Press', sets: 4, reps: '10-12', notes: 'Full range of motion' },
          { name: 'Bent-Over Rows', sets: 4, reps: '12-15', notes: 'Squeeze shoulder blades' },
          { name: 'Tricep Dips', sets: 3, reps: '12-15', notes: 'Body weight to start' },
          { name: 'Bicep Curls', sets: 3, reps: '12-15', notes: 'Control the movement' }
        ]
      },
      {
        name: 'Lower Body Power',
        description: 'Focus on leg strength and power',
        type: 'strength',
        exercises: [
          { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', notes: 'Feel the hamstrings stretch' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each leg', notes: 'Keep front knee stable' },
          { name: 'Leg Press', sets: 4, reps: '12-15', notes: 'Full range of motion' },
          { name: 'Calf Raises', sets: 4, reps: '15-20', notes: 'Pause at the top' }
        ]
      },
      {
        name: 'Core and Stability',
        description: 'Core strength and stability training',
        type: 'strength',
        exercises: [
          { name: 'Planks', sets: 3, reps: '45 seconds', notes: 'Keep body straight' },
          { name: 'Russian Twists', sets: 3, reps: '20 each side', notes: 'Control the movement' },
          { name: 'Dead Bugs', sets: 3, reps: '12 each side', notes: 'Keep lower back pressed down' },
          { name: 'Bird Dogs', sets: 3, reps: '10 each side', notes: 'Maintain balance' }
        ]
      },
      {
        name: 'Metabolic Conditioning',
        description: 'High-intensity metabolic workout',
        type: 'cardio',
        exercises: [
          { name: 'Kettlebell Swings', sets: 4, reps: '20', notes: 'Hip hinge movement' },
          { name: 'Box Jumps', sets: 4, reps: '12', notes: 'Land softly' },
          { name: 'Battle Ropes', sets: 3, reps: '30 seconds', notes: 'Alternate waves' },
          { name: 'Medicine Ball Slams', sets: 3, reps: '15', notes: 'Explosive movement' }
        ]
      }
    ];

    // Function to shuffle array
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Process the workouts and create a structured plan
    const processWorkouts = (workouts: any[], userGoals: string): string => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const shuffledWorkouts = shuffleArray([...workouts]);
      
      let plan = `7-Day Workout Plan Based on Your Goals: ${userGoals}\n\n`;

      days.forEach((day, index) => {
        // Use modulo to cycle through workouts, but with shuffled order
        const workout = shuffledWorkouts[index % shuffledWorkouts.length];
        plan += `${day}:\n`;
        plan += `🏋️ Workout: ${workout.name}\n`;
        plan += `📝 Description: ${workout.description}\n`;
        plan += `💪 Type: ${workout.type}\n\n`;

        if (workout.exercises) {
          plan += "Exercises:\n";
          workout.exercises.forEach((exercise: any, i: number) => {
            plan += `${i + 1}. ${exercise.name}\n`;
            plan += `   • Sets: ${exercise.sets}\n`;
            plan += `   • Reps: ${exercise.reps}\n`;
            plan += `   • Notes: ${exercise.notes}\n\n`;
          });
        }
      });

      plan += "\nImportant Notes:\n";
      plan += "✓ Always warm up properly before starting your workout\n";
      plan += "✓ Stay hydrated throughout your sessions\n";
      plan += "✓ Rest 60-90 seconds between sets for strength exercises\n";
      plan += "✓ Adjust weights and intensity based on your fitness level\n";
      plan += "✓ Listen to your body and avoid overtraining\n";
      plan += "✓ Consult with a healthcare professional before starting any new exercise program";

      return plan;
    };

    const workoutPlan = processWorkouts(workoutTemplates, prompt);

    return new Response(
      JSON.stringify({ workout: workoutPlan }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error generating workout:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate workout plan. Please try again.',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});