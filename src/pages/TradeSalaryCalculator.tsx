import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";


import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, Home } from "lucide-react";

const TradeSalaryCalculator = () => {
  const [trade, setTrade] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("0-1");
  const [unionStatus, setUnionStatus] = useState("non-union");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [hasOT, setHasOT] = useState(false);
  const [otHours, setOtHours] = useState([0]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);

  const trades = [
    "HVAC Technician",
    "Electrician",
    "Plumber",
    "Welder",
    "Carpenter",
    "CDL Truck Driver",
    "Diesel Mechanic",
    "Auto Technician",
    "Lineworker",
    "General Labor",
    "Other"
  ];

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

  const certificationOptions = [
    "EPA 608",
    "CDL-A",
    "Journeyman License",
    "Master Electrician",
    "OSHA 10",
    "OSHA 30",
    "Welding Certification",
    "Red Seal",
  ];

  // Base salary data (sample - would be replaced with real data)
  const baseSalaries: any = {
    "HVAC Technician": { base: 45000, stateMultiplier: { "California": 1.3, "Texas": 1.0, "New York": 1.25 } },
    "Electrician": { base: 52000, stateMultiplier: { "California": 1.35, "Texas": 1.0, "New York": 1.3 } },
    "Plumber": { base: 50000, stateMultiplier: { "California": 1.3, "Texas": 1.0, "New York": 1.25 } },
    "Welder": { base: 42000, stateMultiplier: { "California": 1.2, "Texas": 1.0, "New York": 1.15 } },
    "Carpenter": { base: 46000, stateMultiplier: { "California": 1.25, "Texas": 1.0, "New York": 1.2 } },
    "CDL Truck Driver": { base: 48000, stateMultiplier: { "California": 1.2, "Texas": 1.0, "New York": 1.15 } },
    "Diesel Mechanic": { base: 47000, stateMultiplier: { "California": 1.25, "Texas": 1.0, "New York": 1.2 } },
    "Auto Technician": { base: 40000, stateMultiplier: { "California": 1.3, "Texas": 1.0, "New York": 1.25 } },
    "Lineworker": { base: 60000, stateMultiplier: { "California": 1.3, "Texas": 1.0, "New York": 1.25 } },
    "General Labor": { base: 35000, stateMultiplier: { "California": 1.3, "Texas": 1.0, "New York": 1.2 } },
    "Other": { base: 45000, stateMultiplier: {} },
  };

  const calculateSalary = () => {
    if (!trade || !state) return;

    const tradeData = baseSalaries[trade] || baseSalaries["Other"];
    let baseSalary = tradeData.base;

    // State multiplier
    const stateMultiplier = tradeData.stateMultiplier[state] || 1.0;
    baseSalary *= stateMultiplier;

    // Experience multiplier
    const experienceMultipliers: any = {
      "0-1": 1.0,
      "1-3": 1.15,
      "3-5": 1.3,
      "5-10": 1.5,
      "10+": 1.7,
    };
    baseSalary *= experienceMultipliers[experience];

    // Union bonus
    if (unionStatus === "union") {
      baseSalary *= 1.2;
    }

    // Certification bonuses
    const certBonus = certifications.length * 0.05; // 5% per cert
    baseSalary *= (1 + certBonus);

    // Calculate hourly
    const baseHourly = baseSalary / 52 / hoursPerWeek;
    
    // Calculate with OT
    let weeklyPay = baseHourly * hoursPerWeek;
    if (hasOT && otHours[0] > 0) {
      weeklyPay += (baseHourly * 1.5 * otHours[0]);
    }

    const annualWithOT = weeklyPay * 52;
    const monthlyPay = annualWithOT / 12;

    // Calculate range (±15%)
    const low = Math.round(annualWithOT * 0.85);
    const high = Math.round(annualWithOT * 1.15);

    // Career progression
    const careerPath = [
      { year: 1, salary: Math.round(baseSalaries[trade]?.base || 45000) },
      { year: 3, salary: Math.round((baseSalaries[trade]?.base || 45000) * 1.25) },
      { year: 5, salary: Math.round((baseSalaries[trade]?.base || 45000) * 1.5) },
      { year: 10, salary: Math.round((baseSalaries[trade]?.base || 45000) * 1.8) },
    ];

    setResults({
      hourly: Math.round(baseHourly * 100) / 100,
      weekly: Math.round(weeklyPay),
      monthly: Math.round(monthlyPay),
      annual: Math.round(annualWithOT),
      low,
      high,
      careerPath,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-1">
        

        <section className="py-12">
          <div className="container">
            <div className="max-w-5xl mx-auto">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>Enter your details to calculate your earning potential</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Trade</Label>
                      <Select value={trade} onValueChange={setTrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your trade" />
                        </SelectTrigger>
                        <SelectContent>
                          {trades.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>City or ZIP (Optional)</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Houston or 77001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <RadioGroup value={experience} onValueChange={setExperience}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-1" id="exp1" />
                          <Label htmlFor="exp1">0-1 years (New)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1-3" id="exp2" />
                          <Label htmlFor="exp2">1-3 years (Junior)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3-5" id="exp3" />
                          <Label htmlFor="exp3">3-5 years (Intermediate)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5-10" id="exp4" />
                          <Label htmlFor="exp4">5-10 years (Experienced)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="10+" id="exp5" />
                          <Label htmlFor="exp5">10+ years (Senior)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Union Status</Label>
                      <RadioGroup value={unionStatus} onValueChange={setUnionStatus}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="union" id="union" />
                          <Label htmlFor="union">Union</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-union" id="non-union" />
                          <Label htmlFor="non-union">Non-Union</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Certifications</Label>
                      <div className="space-y-2">
                        {certificationOptions.map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Checkbox
                              id={cert}
                              checked={certifications.includes(cert)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setCertifications([...certifications, cert]);
                                } else {
                                  setCertifications(certifications.filter(c => c !== cert));
                                }
                              }}
                            />
                            <Label htmlFor={cert} className="font-normal">{cert}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Hours Per Week: {hoursPerWeek}</Label>
                      <Slider
                        value={[hoursPerWeek]}
                        onValueChange={(value) => setHoursPerWeek(value[0])}
                        min={20}
                        max={60}
                        step={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="overtime"
                          checked={hasOT}
                          onCheckedChange={(checked) => setHasOT(!!checked)}
                        />
                        <Label htmlFor="overtime">Include Overtime</Label>
                      </div>
                      {hasOT && (
                        <div className="mt-2">
                          <Label>Overtime Hours Per Week: {otHours[0]}</Label>
                          <Slider
                            value={otHours}
                            onValueChange={setOtHours}
                            min={0}
                            max={20}
                            step={1}
                          />
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={calculateSalary} 
                      className="w-full bg-accent hover:bg-accent/90"
                      disabled={!trade || !state}
                    >
                      Calculate My Salary
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-6">
                  {results ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Estimated Earnings</CardTitle>
                          <CardDescription>
                            Based on {trade} in {state}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">Hourly</p>
                              <p className="text-2xl font-bold">${results.hourly}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">Weekly</p>
                              <p className="text-2xl font-bold">${results.weekly.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">Monthly</p>
                              <p className="text-2xl font-bold">${results.monthly.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                              <p className="text-sm">Annual</p>
                              <p className="text-2xl font-bold">${results.annual.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <p className="font-semibold mb-2">Typical Range</p>
                            <p className="text-sm text-muted-foreground">
                              ${results.low.toLocaleString()} - ${results.high.toLocaleString()} per year
                            </p>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            These numbers are estimated based on industry data. Actual pay can vary by company, city, and specific experience.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Apprentice-to-Pro Path</CardTitle>
                          <CardDescription>Projected earnings over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {results.careerPath.map((path: any) => (
                              <div key={path.year} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                <span className="font-semibold">Year {path.year}</span>
                                <span className="text-lg">${path.salary.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Link to={`/cost-of-living-calculator?income=${results.annual}`}>
                            <Button variant="outline" className="w-full justify-start">
                              <Home className="mr-2 h-4 w-4" />
                              Compare Cost of Living With This Salary
                            </Button>
                          </Link>
                          <Link to={`/travel-vs-local-calculator?local=${results.hourly}`}>
                            <Button variant="outline" className="w-full justify-start">
                              <TrendingUp className="mr-2 h-4 w-4" />
                              See If Travel Work Beats This
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                          <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Fill out the form and click "Calculate My Salary" to see your earning potential</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>

      
    </div>
  );
};

export default TradeSalaryCalculator;
