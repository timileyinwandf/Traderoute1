import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";


import { useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const CostOfLivingCalculator = () => {
  const [searchParams] = useSearchParams();
  const [currentCity, setCurrentCity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [targetCity, setTargetCity] = useState("");
  const [targetState, setTargetState] = useState("");
  const [annualIncome, setAnnualIncome] = useState(searchParams.get("income") || "");
  const [householdSize, setHouseholdSize] = useState("1");
  const [housingType, setHousingType] = useState("renting");
  const [monthlyHousing, setMonthlyHousing] = useState("");
  const [utilities, setUtilities] = useState("150");
  const [groceries, setGroceries] = useState("400");
  const [transportation, setTransportation] = useState("300");
  const [insurance, setInsurance] = useState("200");
  const [debt, setDebt] = useState("0");
  const [misc, setMisc] = useState("200");
  const [taxRate, setTaxRate] = useState([20]);
  const [results, setResults] = useState<any>(null);

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

  // State cost-of-living index (baseline = 1.0)
  const stateColIndex: Record<string, number> = {
    "Alabama": 0.88, "Alaska": 1.27, "Arizona": 0.97, "Arkansas": 0.86, "California": 1.38,
    "Colorado": 1.05, "Connecticut": 1.27, "Delaware": 1.02, "District of Columbia": 1.52,
    "Florida": 0.99, "Georgia": 0.90, "Hawaii": 1.82, "Idaho": 0.92, "Illinois": 0.95,
    "Indiana": 0.88, "Iowa": 0.89, "Kansas": 0.87, "Kentucky": 0.86, "Louisiana": 0.90,
    "Maine": 1.08, "Maryland": 1.29, "Massachusetts": 1.32, "Michigan": 0.89, "Minnesota": 0.97,
    "Mississippi": 0.84, "Missouri": 0.87, "Montana": 1.00, "Nebraska": 0.91, "Nevada": 1.04,
    "New Hampshire": 1.15, "New Jersey": 1.26, "New Mexico": 0.91, "New York": 1.39,
    "North Carolina": 0.92, "North Dakota": 0.98, "Ohio": 0.89, "Oklahoma": 0.86,
    "Oregon": 1.13, "Pennsylvania": 0.98, "Rhode Island": 1.19, "South Carolina": 0.89,
    "South Dakota": 0.95, "Tennessee": 0.89, "Texas": 0.91, "Utah": 0.97, "Vermont": 1.13,
    "Virginia": 1.03, "Washington": 1.15, "West Virginia": 0.84, "Wisconsin": 0.94, "Wyoming": 0.92
  };

  const calculateCostOfLiving = () => {
    if (!annualIncome || !currentState) return;

    const income = parseFloat(annualIncome);
    const netMonthly = (income * (1 - taxRate[0] / 100)) / 12;
    
    const currentExpenses = {
      housing: parseFloat(monthlyHousing) || 0,
      utilities: parseFloat(utilities),
      groceries: parseFloat(groceries),
      transportation: parseFloat(transportation),
      insurance: parseFloat(insurance),
      debt: parseFloat(debt),
      misc: parseFloat(misc),
    };

    const currentTotal = Object.values(currentExpenses).reduce((a, b) => a + b, 0);
    const currentLeftover = netMonthly - currentTotal;
    const currentFixedCostPercent = (currentTotal / netMonthly) * 100;

    // Target city calculation using state COL index
    let targetTotal = currentTotal;
    let targetLeftover = netMonthly - currentTotal;
    
    if (targetState && targetState !== currentState) {
      const currentIndex = stateColIndex[currentState] || 1.0;
      const targetIndex = stateColIndex[targetState] || 1.0;
      const colRatio = targetIndex / currentIndex;
      
      // Apply COL ratio to variable expenses (housing, utilities, groceries, transportation)
      // Keep debt and insurance the same as they don't typically vary by location
      targetTotal = (
        (currentExpenses.housing + currentExpenses.utilities + 
         currentExpenses.groceries + currentExpenses.transportation + currentExpenses.misc) * colRatio
      ) + currentExpenses.debt + currentExpenses.insurance;
      
      targetLeftover = netMonthly - targetTotal;
    }

    // Buying power score (0-100)
    const currentScore = Math.max(0, Math.min(100, (currentLeftover / netMonthly) * 200));
    const targetScore = Math.max(0, Math.min(100, (targetLeftover / netMonthly) * 200));

    // Status labels
    const getStatus = (leftover: number, percent: number) => {
      if (leftover < 0) return { label: "Barely Surviving", color: "text-destructive" };
      if (percent > 70) return { label: "Covering Basics", color: "text-yellow-600" };
      if (leftover > netMonthly * 0.3) return { label: "Comfortably Ahead", color: "text-green-600" };
      return { label: "Getting By", color: "text-blue-600" };
    };

    setResults({
      netMonthly,
      current: {
        expenses: currentExpenses,
        total: currentTotal,
        leftover: currentLeftover,
        fixedCostPercent: currentFixedCostPercent,
        score: currentScore,
        status: getStatus(currentLeftover, currentFixedCostPercent),
      },
      target: targetState ? {
        total: targetTotal,
        leftover: targetLeftover,
        score: targetScore,
        status: getStatus(targetLeftover, (targetTotal / netMonthly) * 100),
      } : null,
    });
  };

  useEffect(() => {
    if (searchParams.get("income")) {
      calculateCostOfLiving();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-1">
        

        <section className="py-12">
          <div className="container">
            <div className="max-w-5xl mx-auto">

              <div className="space-y-6">
                {/* Income & Location */}
                <Card>
                  <CardHeader>
                    <CardTitle>Income & Location</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current City</Label>
                      <Input
                        value={currentCity}
                        onChange={(e) => setCurrentCity(e.target.value)}
                        placeholder="e.g., Houston"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current State</Label>
                      <Select value={currentState} onValueChange={setCurrentState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Income</Label>
                      <Input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        placeholder="e.g., 55000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Household Size</Label>
                      <Select value={householdSize} onValueChange={setHouseholdSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Just me</SelectItem>
                          <SelectItem value="2">2 people</SelectItem>
                          <SelectItem value="3-4">3-4 people</SelectItem>
                          <SelectItem value="5+">5+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tax Rate: {taxRate[0]}%</Label>
                      <Slider
                        value={taxRate}
                        onValueChange={setTaxRate}
                        min={10}
                        max={35}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Housing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Housing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={housingType} onValueChange={setHousingType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="renting" id="renting" />
                        <Label htmlFor="renting">Renting</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="owning" id="owning" />
                        <Label htmlFor="owning">Owning (Mortgage)</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label>Monthly {housingType === "renting" ? "Rent" : "Mortgage"}</Label>
                      <Input
                        type="number"
                        value={monthlyHousing}
                        onChange={(e) => setMonthlyHousing(e.target.value)}
                        placeholder="e.g., 1200"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Expenses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Utilities</Label>
                      <Input
                        type="number"
                        value={utilities}
                        onChange={(e) => setUtilities(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Groceries</Label>
                      <Input
                        type="number"
                        value={groceries}
                        onChange={(e) => setGroceries(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Transportation</Label>
                      <Input
                        type="number"
                        value={transportation}
                        onChange={(e) => setTransportation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Insurance</Label>
                      <Input
                        type="number"
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Debt Payments</Label>
                      <Input
                        type="number"
                        value={debt}
                        onChange={(e) => setDebt(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Miscellaneous/Fun Money</Label>
                      <Input
                        type="number"
                        value={misc}
                        onChange={(e) => setMisc(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Target Location (Optional) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compare to Target Location (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target City</Label>
                      <Input
                        value={targetCity}
                        onChange={(e) => setTargetCity(e.target.value)}
                        placeholder="e.g., Denver"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target State</Label>
                      <Select value={targetState} onValueChange={setTargetState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={calculateCostOfLiving} 
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={!annualIncome || !currentState}
                >
                  Calculate Cost of Living
                </Button>

                {/* Results */}
                {results && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Current Location */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Current: {currentCity || currentState}</CardTitle>
                        <CardDescription>Your current financial situation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Net Monthly Income</span>
                            <span className="font-semibold">${results.netMonthly.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Expenses</span>
                            <span className="font-semibold">${results.current.total.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Money Left Over</span>
                            <span className={results.current.leftover >= 0 ? "text-green-600" : "text-destructive"}>
                              ${results.current.leftover.toFixed(0)}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Buying Power Score</p>
                          <p className="text-3xl font-bold">{results.current.score.toFixed(0)}/100</p>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${
                          results.current.status.label === "Barely Surviving" ? "border-destructive bg-destructive/10" :
                          results.current.status.label === "Covering Basics" ? "border-yellow-600 bg-yellow-50" :
                          results.current.status.label === "Comfortably Ahead" ? "border-green-600 bg-green-50" :
                          "border-blue-600 bg-blue-50"
                        }`}>
                          <p className={`font-bold text-lg ${results.current.status.color}`}>
                            {results.current.status.label}
                          </p>
                          <p className="text-sm mt-1">
                            {results.current.fixedCostPercent.toFixed(0)}% of income goes to fixed costs
                          </p>
                        </div>

                        {results.current.fixedCostPercent > 35 && parseFloat(monthlyHousing) / results.netMonthly > 0.35 && (
                          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-semibold text-yellow-800">Housing Warning</p>
                              <p className="text-yellow-700">Your rent/mortgage is over 35% of income. This leaves less room for emergencies.</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Target Location */}
                    {results.target && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Target: {targetCity || targetState}</CardTitle>
                          <CardDescription>Estimated costs in new location</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net Monthly Income</span>
                              <span className="font-semibold">${results.netMonthly.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Estimated Expenses</span>
                              <span className="font-semibold">${results.target.total.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                              <span>Money Left Over</span>
                              <span className={results.target.leftover >= 0 ? "text-green-600" : "text-destructive"}>
                                ${results.target.leftover.toFixed(0)}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Buying Power Score</p>
                            <p className="text-3xl font-bold">{results.target.score.toFixed(0)}/100</p>
                          </div>

                          <div className={`p-4 rounded-lg border-2 ${
                            results.target.status.label === "Barely Surviving" ? "border-destructive bg-destructive/10" :
                            results.target.status.label === "Covering Basics" ? "border-yellow-600 bg-yellow-50" :
                            results.target.status.label === "Comfortably Ahead" ? "border-green-600 bg-green-50" :
                            "border-blue-600 bg-blue-50"
                          }`}>
                            <p className={`font-bold text-lg ${results.target.status.color}`}>
                              {results.target.status.label}
                            </p>
                          </div>

                          <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                            <p className="font-semibold mb-2">Recommendation</p>
                            <p className="text-sm">
                              {results.target.leftover > results.current.leftover 
                                ? `On paper, ${targetCity || targetState} gives you more breathing room. Consider negotiating a cost-of-living adjustment if moving.`
                                : `Right now, staying in ${currentCity || currentState} might give you more financial stability.`}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        
      </main>

      
    </div>
  );
};

export default CostOfLivingCalculator;
