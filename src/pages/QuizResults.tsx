import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, TrendingUp, Calculator } from "lucide-react";

const QuizResults = () => {
  const location = useLocation();
  const scores = location.state?.scores || {};

  // Convert scores to sorted array
  const tradeScores = Object.entries(scores)
    .map(([trade, score]) => ({ trade, score: score as number }))
    .sort((a, b) => b.score - a.score);

  const topTrade = tradeScores[0];
  const alternates = tradeScores.slice(1, 3);

  const tradeInfo: { [key: string]: any } = {
    hvac: {
      name: "HVAC Technician",
      description: "Install, maintain, and repair heating, ventilation, air conditioning, and refrigeration systems.",
      dailyWork: "You'll work on HVAC systems in homes, businesses, and industrial facilities. Mix of troubleshooting, installation, and routine maintenance.",
      environments: "Residential homes, commercial buildings, sometimes outdoors for rooftop units. Climate-controlled most of the time.",
      pros: [
        "High demand year-round",
        "Good pay potential with experience",
        "Can start own business relatively easily",
        "Problem-solving and customer interaction",
      ],
      cons: [
        "Can involve tight spaces (attics, crawl spaces)",
        "Physically demanding at times",
        "On-call work and weekend emergencies",
        "Requires EPA certification",
      ],
      avgSalary: "45-65k",
    },
    electrician: {
      name: "Electrician",
      description: "Install, maintain, and repair electrical systems in residential, commercial, and industrial settings.",
      dailyWork: "Wire buildings, troubleshoot electrical issues, install lighting and power systems. Mix of new construction and service work.",
      environments: "Construction sites, homes, commercial buildings. Can involve heights and working in various conditions.",
      pros: [
        "Excellent job security and demand",
        "Higher earning potential than many trades",
        "Apprenticeship-to-journeyman path is well-established",
        "Can specialize (industrial, residential, commercial)",
      ],
      cons: [
        "Risk of electrical shock if not careful",
        "Long apprenticeship period",
        "Can require working at heights",
        "Continuous education for code changes",
      ],
      avgSalary: "50-75k",
    },
    plumber: {
      name: "Plumber",
      description: "Install and repair pipes, fixtures, and plumbing systems for water, gas, and drainage.",
      dailyWork: "Install new plumbing systems, fix leaks, clear clogs, work on water heaters and fixtures. Service calls and new construction.",
      environments: "Homes, businesses, construction sites. Often crawl spaces, basements, and under sinks.",
      pros: [
        "Always in demand (people always need water and drains)",
        "Good pay, especially for experienced plumbers",
        "Can start own business",
        "Mix of service and installation work",
      ],
      cons: [
        "Messy work at times",
        "Tight spaces and awkward positions",
        "On-call emergencies",
        "Physically demanding",
      ],
      avgSalary: "48-68k",
    },
    welder: {
      name: "Welder",
      description: "Join metal parts using heat and specialized equipment for construction, manufacturing, and repair.",
      dailyWork: "Read blueprints, set up welding equipment, join metal components. Work in shops, construction sites, or industrial facilities.",
      environments: "Manufacturing plants, construction sites, shipyards, or welding shops. Often hot and requires safety gear.",
      pros: [
        "High demand in manufacturing and construction",
        "Good pay, especially for specialized welding",
        "Can travel for high-paying contracts",
        "Creative and hands-on work",
      ],
      cons: [
        "Hot work environment with protective gear",
        "Risk of burns and eye damage without precautions",
        "Physically demanding",
        "Can involve repetitive tasks in manufacturing",
      ],
      avgSalary: "42-62k",
    },
    carpenter: {
      name: "Carpenter",
      description: "Build, install, and repair structures and fixtures made from wood and other materials.",
      dailyWork: "Frame buildings, install cabinets and trim, build stairs and decks. Mix of rough carpentry (framing) and finish work.",
      environments: "Construction sites, homes, commercial buildings. Often outdoors and at heights.",
      pros: [
        "Tangible results you can see and take pride in",
        "Wide variety of work (framing, finishing, cabinetry)",
        "Can start own contracting business",
        "Consistent demand in construction",
      ],
      cons: [
        "Physically demanding and hard on the body",
        "Work slows in bad weather",
        "Risk of injury (cuts, falls)",
        "Can be seasonal in some regions",
      ],
      avgSalary: "44-62k",
    },
    cdl: {
      name: "CDL Truck Driver",
      description: "Transport goods across short or long distances using commercial trucks.",
      dailyWork: "Drive trucks, load/unload cargo, navigate routes, maintain logs. Can be local delivery or long-haul.",
      environments: "On the road—highways, warehouses, loading docks. Solo time in the cab.",
      pros: [
        "Quick entry (CDL training is relatively fast)",
        "Good pay, especially long-haul",
        "Independence and freedom",
        "Always in demand",
      ],
      cons: [
        "Long hours away from home (for long-haul)",
        "Sedentary lifestyle affects health",
        "Irregular schedule",
        "Can be lonely",
      ],
      avgSalary: "45-65k",
    },
    mechanic: {
      name: "Diesel/Auto Mechanic",
      description: "Diagnose, maintain, and repair vehicles—cars, trucks, buses, or heavy equipment.",
      dailyWork: "Troubleshoot mechanical issues, perform maintenance, replace parts. Mix of diagnostics and hands-on repair.",
      environments: "Auto shops, dealerships, fleet maintenance facilities. Indoor, climate-controlled most of the time.",
      pros: [
        "Strong job security",
        "Good problem-solving and diagnostic work",
        "Can specialize (diesel, auto, heavy equipment)",
        "Opportunities at dealerships and independent shops",
      ],
      cons: [
        "Physically demanding (lifting, bending)",
        "Exposure to chemicals and loud noises",
        "Requires ongoing learning as tech evolves",
        "Can be repetitive",
      ],
      avgSalary: "42-60k",
    },
  };

  const recommendedTrade = tradeInfo[topTrade?.trade] || tradeInfo.hvac;

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-1">
        

        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Main Result */}
              <div className="text-center mb-12">
                <Badge className="mb-4 text-lg py-2 px-4 bg-accent text-accent-foreground">
                  Your Best Fit Trade
                </Badge>
                <h1 className="text-5xl font-bold mb-4">{recommendedTrade.name}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {recommendedTrade.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg. Salary Range</p>
                    <p className="text-2xl font-bold">${recommendedTrade.avgSalary}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Match Score</p>
                    <p className="text-2xl font-bold">{topTrade?.score || 0} pts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calculator className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Entry Time</p>
                    <p className="text-2xl font-bold">1-4 yrs</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Actually Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{recommendedTrade.dailyWork}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Work Environments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{recommendedTrade.environments}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Pros</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {recommendedTrade.pros.map((pro: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-green-600">✓</span>
                            <span className="text-muted-foreground">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-yellow-600" />
                        <span>Cons</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {recommendedTrade.cons.map((con: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-yellow-600">!</span>
                            <span className="text-muted-foreground">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Alternate Trades */}
                {alternates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Other Good Fits for You</CardTitle>
                      <CardDescription>These trades also scored well based on your answers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {alternates.map((alt) => {
                          const altInfo = tradeInfo[alt.trade];
                          return (
                            <div key={alt.trade} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{altInfo?.name}</h4>
                                <Badge variant="outline">{alt.score} pts</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{altInfo?.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* CTAs */}
                <Card className="bg-accent/10">
                  <CardHeader>
                    <CardTitle>Ready to Run the Numbers?</CardTitle>
                    <CardDescription>
                      See what you could actually earn as a {recommendedTrade.name} in your state
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to={`/trade-salary-calculator`}>
                      <Button className="w-full bg-accent hover:bg-accent/90">
                        Check Your Salary in Your State
                      </Button>
                    </Link>
                    <Link to="/cost-of-living-calculator">
                      <Button variant="outline" className="w-full">
                        See If Your Pay Covers Your Bills
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  This quiz gives you a strong starting point, but it's not perfect. Try the calculators to see real numbers for your situation.
                </p>
                <Link to="/trade-quiz">
                  <Button variant="ghost">Take Quiz Again</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        
      </main>

      
    </div>
  );
};

export default QuizResults;
