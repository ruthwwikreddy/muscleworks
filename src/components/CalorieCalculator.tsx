import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CalorieCalculator = () => {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calories, setCalories] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateCalories = () => {
    if (!age || !weight || !height) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    setCalories(Math.round(tdee));
  };

  return (
    <section className="py-20 bg-black" id="calorie-calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Calorie Calculator</h2>
          <div className="relative">
            <h3 className="text-4xl font-bold text-white mb-8">
              Calculate Your Daily Calorie Needs
            </h3>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-muscle-red"></div>
          </div>
        </div>

        <Card className="max-w-md mx-auto bg-white">
          <CardHeader>
            <CardTitle className="text-center">Calculate Daily Calories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              defaultValue="male"
              onValueChange={(value) => setGender(value)}
              className="flex space-x-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male-cal" />
                <Label htmlFor="male-cal">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female-cal" />
                <Label htmlFor="female-cal">Female</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Height (cm)</label>
              <Input
                type="number"
                placeholder="Enter your height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Level</label>
              <Select onValueChange={setActivityLevel} defaultValue="sedentary">
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 times/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 4-5 times/week)</SelectItem>
                  <SelectItem value="active">Active (daily exercise or intense exercise 3-4 times/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (intense exercise 6-7 times/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={calculateCalories}
              className="w-full bg-muscle-red hover:bg-red-600 transition-colors"
            >
              Calculate Calories
            </Button>
            {calories !== null && (
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">Your Daily Calorie Needs:</p>
                <p className="text-2xl font-bold text-muscle-red">{calories} calories</p>
                <p className="text-sm text-gray-600 mt-2">
                  This is your maintenance calories. Adjust by ±500 calories for weight loss/gain.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CalorieCalculator;