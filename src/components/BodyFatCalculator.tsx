import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const BodyFatCalculator = () => {
  const [gender, setGender] = useState("male");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [height, setHeight] = useState("");
  const [hip, setHip] = useState("");
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateBodyFat = () => {
    if (!waist || !neck || !height || (gender === "female" && !hip)) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required measurements.",
        variant: "destructive",
      });
      return;
    }

    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);

    if (gender === "male") {
      const bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      setBodyFat(parseFloat(bodyFatPercentage.toFixed(1)));
    } else {
      const hipMeasurement = parseFloat(hip);
      const bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(w + hipMeasurement - n) + 0.22100 * Math.log10(h)) - 450;
      setBodyFat(parseFloat(bodyFatPercentage.toFixed(1)));
    }
  };

  const getBodyFatCategory = (bf: number) => {
    if (gender === "male") {
      if (bf < 6) return { category: "Essential Fat", color: "text-blue-500" };
      if (bf < 14) return { category: "Athletes", color: "text-green-500" };
      if (bf < 18) return { category: "Fitness", color: "text-yellow-500" };
      if (bf < 25) return { category: "Average", color: "text-orange-500" };
      return { category: "Obese", color: "text-red-500" };
    } else {
      if (bf < 14) return { category: "Essential Fat", color: "text-blue-500" };
      if (bf < 21) return { category: "Athletes", color: "text-green-500" };
      if (bf < 25) return { category: "Fitness", color: "text-yellow-500" };
      if (bf < 32) return { category: "Average", color: "text-orange-500" };
      return { category: "Obese", color: "text-red-500" };
    }
  };

  return (
    <section className="py-20 bg-black" id="body-fat-calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Body Fat Calculator</h2>
          <div className="relative">
            <h3 className="text-4xl font-bold text-white mb-8">
              Estimate Your Body Fat Percentage
            </h3>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-muscle-red"></div>
          </div>
        </div>

        <Card className="max-w-md mx-auto bg-white">
          <CardHeader>
            <CardTitle className="text-center">Calculate Your Body Fat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              defaultValue="male"
              onValueChange={(value) => setGender(value)}
              className="flex space-x-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>

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
              <label className="text-sm font-medium">Neck (cm)</label>
              <Input
                type="number"
                placeholder="Enter your neck circumference"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Waist (cm)</label>
              <Input
                type="number"
                placeholder="Enter your waist circumference"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
            {gender === "female" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Hip (cm)</label>
                <Input
                  type="number"
                  placeholder="Enter your hip circumference"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                />
              </div>
            )}
            <Button 
              onClick={calculateBodyFat}
              className="w-full bg-muscle-red hover:bg-red-600 transition-colors"
            >
              Calculate Body Fat
            </Button>
            {bodyFat !== null && (
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">Body Fat: {bodyFat}%</p>
                <p className={`text-md ${getBodyFatCategory(bodyFat).color}`}>
                  Category: {getBodyFatCategory(bodyFat).category}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BodyFatCalculator;