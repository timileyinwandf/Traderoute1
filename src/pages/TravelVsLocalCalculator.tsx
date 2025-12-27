import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";


import { useSearchParams, Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Home as HomeIcon, Plane } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TravelVsLocalCalculator = () => {
  const [searchParams] = useSearchParams();
  
  // Local work inputs
  const [localRate, setLocalRate] = useState(searchParams.get("local") || "");
  const [localHours, setLocalHours] = useState("40");
  const [localOT, setLocalOT] = useState("0");
  const [localCommute, setLocalCommute] = useState("50");

  // Travel work inputs
  const [travelRate, setTravelRate] = useState("");
  const [travelHours, setTravelHours] = useState("50");
  const [contractWeeks, setContractWeeks] = useState([13]);
  const [perDiem, setPerDiem] = useState("");
  const [lodgingCost, setLodgingCost] = useState("");
  const [extraFood, setExtraFood] = useState("100");
  const [unPaidWeeks, setUnPaidWeeks] = useState([2]);

  const [results, setResults] = useState<any>(null);

  const calculateComparison = () => {
    if (!localRate || !travelRate) return;

    // Local calculations
    const localHourly = parseFloat(localRate);
    const localWeekly = (localHourly * parseFloat(localHours)) + (localHourly * 1.5 * parseFloat(localOT));
    const localAnnual = (localWeekly * 52) - (parseFloat(localCommute) * 52);

    // Travel calculations
    const travelHourly = parseFloat(travelRate);
    const travelWeekly = travelHourly * parseFloat(travelHours);
    const weeksWorked = 52 - unPaidWeeks[0];
    const contractsPerYear = Math.floor(weeksWorked / contractWeeks[0]);
    
    const travelIncome = travelWeekly * weeksWorked;
    const perDiemIncome = parseFloat(perDiem || "0") * 7 * weeksWorked;
    
    const travelCosts = (
      (parseFloat(lodgingCost || "0") * 7 * weeksWorked) +
      (parseFloat(extraFood) * 4 * (weeksWorked / 4))
    );

    const travelAnnual = travelIncome + perDiemIncome - travelCosts;

    // Calculate difference
    const difference = travelAnnual - localAnnual;
    const percentDiff = (difference / localAnnual) * 100;

    // Calculate break-even
    const breakEvenWeeks = Math.ceil((localAnnual / 52) / (travelWeekly + (parseFloat(perDiem || "0") * 7) - (parseFloat(lodgingCost || "0") * 7) - (parseFloat(extraFood) * 4)));

    setResults({
      local: {
        hourly: localHourly,
        weekly: localWeekly,
        annual: localAnnual,
      },
      travel: {
        hourly: travelHourly,
        weekly: travelWeekly,
        annual: travelAnnual,
        weeksWorked,
        contractsPerYear,
      },
      difference,
      percentDiff,
      breakEvenWeeks,
      winner: difference > 0 ? "travel" : "local",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-1">
        

        <section className="py-12">
          <div className="container">
            <div className="max-w-5xl mx-auto">
             

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Local Work */}
                <Card>
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <HomeIcon className="w-6 h-6 text-primary" />
                      <CardTitle>Local Work</CardTitle>
                    </div>
                    <CardDescription>Your home base scenario</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label>Hourly Rate</Label>
                      <Input
                        type="number"
                        value={localRate}
                        onChange={(e) => setLocalRate(e.target.value)}
                        placeholder="e.g., 28"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hours Per Week</Label>
                      <Input
                        type="number"
                        value={localHours}
                        onChange={(e) => setLocalHours(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Average Overtime Hours Per Week</Label>
                      <Input
                        type="number"
                        value={localOT}
                        onChange={(e) => setLocalOT(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weekly Commuting Cost</Label>
                      <Input
                        type="number"
                        value={localCommute}
                        onChange={(e) => setLocalCommute(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Work */}
                <Card>
                  <CardHeader className="bg-accent/10">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-6 h-6 text-accent" />
                      <CardTitle>Travel Work</CardTitle>
                    </div>
                    <CardDescription>Out-of-town contract scenario</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label>Travel Hourly Rate</Label>
                      <Input
                        type="number"
                        value={travelRate}
                        onChange={(e) => setTravelRate(e.target.value)}
                        placeholder="e.g., 35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hours Per Week</Label>
                      <Input
                        type="number"
                        value={travelHours}
                        onChange={(e) => setTravelHours(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contract Length: {contractWeeks[0]} weeks</Label>
                      <Slider
                        value={contractWeeks}
                        onValueChange={setContractWeeks}
                        min={4}
                        max={26}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weekly Per Diem / Housing Stipend</Label>
                      <Input
                        type="number"
                        value={perDiem}
                        onChange={(e) => setPerDiem(e.target.value)}
                        placeholder="e.g., 500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weekly Lodging Cost (Out-of-Pocket)</Label>
                      <Input
                        type="number"
                        value={lodgingCost}
                        onChange={(e) => setLodgingCost(e.target.value)}
                        placeholder="e.g., 400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Extra Food Costs</Label>
                      <Input
                        type="number"
                        value={extraFood}
                        onChange={(e) => setExtraFood(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unpaid Weeks Per Year: {unPaidWeeks[0]}</Label>
                      <Slider
                        value={unPaidWeeks}
                        onValueChange={setUnPaidWeeks}
                        min={0}
                        max={12}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={calculateComparison} 
                className="w-full bg-accent hover:bg-accent/90"
                disabled={!localRate || !travelRate}
              >
                Compare Local vs Travel
              </Button>

              {/* Results */}
              {results && (
                <div className="mt-8 space-y-6">
                  {/* Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Local Work</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hourly Rate</span>
                          <span className="font-semibold">${results.local.hourly}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weekly Income</span>
                          <span className="font-semibold">${results.local.weekly.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                          <span>Net Annual</span>
                          <span className="text-primary">${results.local.annual.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Travel Work</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hourly Rate</span>
                          <span className="font-semibold">${results.travel.hourly}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weeks Worked</span>
                          <span className="font-semibold">{results.travel.weeksWorked} weeks</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                          <span>Net Annual</span>
                          <span className="text-accent">${results.travel.annual.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Winner Card */}
                  <Card className={results.winner === "travel" ? "border-accent border-2" : "border-primary border-2"}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {results.winner === "travel" ? (
                          <>
                            <TrendingUp className="w-6 h-6 text-accent" />
                            <span>Travel Work Pays More</span>
                          </>
                        ) : (
                          <>
                            <HomeIcon className="w-6 h-6 text-primary" />
                            <span>Local Work Keeps More Money</span>
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-accent mb-2">
                          {results.winner === "travel" ? "+" : ""}${Math.abs(results.difference).toLocaleString()}
                        </p>
                        <p className="text-lg text-muted-foreground">
                          {results.percentDiff >= 0 ? "+" : ""}{results.percentDiff.toFixed(1)}% difference per year
                        </p>
                      </div>

                      {results.winner === "travel" ? (
                        <div className="p-4 bg-accent/10 rounded-lg">
                          <p className="font-semibold mb-2">Travel Premium</p>
                          <p className="text-sm text-muted-foreground">
                            Travel work beats local by ${Math.abs(results.difference).toLocaleString()}/year after all costs. You'll work {results.travel.weeksWorked} weeks and be away from home more.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <p className="font-semibold mb-2">Local Advantage</p>
                          <p className="text-sm text-muted-foreground">
                            Local work keeps ${Math.abs(results.difference).toLocaleString()} more in your pocket after subtracting travel expenses. Plus you keep steady routine and family time.
                          </p>
                        </div>
                      )}

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold mb-2">Break-Even Point</p>
                        <p className="text-sm text-muted-foreground">
                          You need at least {results.breakEvenWeeks} travel weeks before you actually come out ahead vs staying local.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lifestyle Note */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lifestyle Fit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Money isn't everything. Consider these factors:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Travel work means being away from home {results.travel.weeksWorked} weeks per year</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Local work provides stability, routine, and family time</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Travel contracts can have gaps between jobs</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Local work may offer better benefits and job security</span>
                        </li>
                      </ul>
                      <Link to="/trade-quiz" className="inline-block mt-4">
                        <Button variant="outline">Find the Best Trade for You</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Visual Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Local Work</span>
                          <span className="text-sm font-bold">${results.local.annual.toLocaleString()}</span>
                        </div>
                        <Progress value={50} className="h-8" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Travel Work</span>
                          <span className="text-sm font-bold">${results.travel.annual.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(results.travel.annual / results.local.annual) * 50} 
                          className="h-8 bg-accent" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        
      </main>

      
    </div>
  );
};

export default TravelVsLocalCalculator;
