import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    scores: { [key: string]: number };
  }[];
}

const TradeQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({
    hvac: 0,
    electrician: 0,
    plumber: 0,
    welder: 0,
    carpenter: 0,
    cdl: 0,
    mechanic: 0,
  });

  const questions: Question[] = [
    {
      id: 0,
      question: "Do you prefer working indoors or outdoors?",
      options: [
        { label: "Mostly indoors, climate controlled", scores: { hvac: 2, electrician: 2, plumber: 1 } },
        { label: "Mix of both, doesn't matter much", scores: { carpenter: 1, welder: 1, mechanic: 1 } },
        { label: "Outdoors, I like being outside", scores: { carpenter: 2, welder: 1 } },
        { label: "On the road, traveling", scores: { cdl: 3 } },
      ],
    },
    {
      id: 1,
      question: "How comfortable are you with heights or tight spaces?",
      options: [
        { label: "Heights are fine, tight spaces not so much", scores: { electrician: 2, carpenter: 1 } },
        { label: "Tight spaces are okay, heights not really", scores: { plumber: 2, hvac: 1 } },
        { label: "Both are fine", scores: { electrician: 1, hvac: 1 } },
        { label: "Rather avoid both", scores: { mechanic: 2, cdl: 1, welder: 1 } },
      ],
    },
    {
      id: 2,
      question: "Which type of work sounds most interesting?",
      options: [
        { label: "Working with electricity and wiring", scores: { electrician: 3 } },
        { label: "Heating, cooling, and air systems", scores: { hvac: 3 } },
        { label: "Pipes, water systems, and fixtures", scores: { plumber: 3 } },
        { label: "Metal, fabrication, and welding", scores: { welder: 3 } },
        { label: "Building structures and woodwork", scores: { carpenter: 3 } },
        { label: "Engines, vehicles, and mechanics", scores: { mechanic: 3 } },
        { label: "Driving trucks or heavy equipment", scores: { cdl: 3 } },
      ],
    },
    {
      id: 3,
      question: "What's your ideal schedule?",
      options: [
        { label: "Steady 9-5, Monday to Friday", scores: { electrician: 1, carpenter: 1 } },
        { label: "Flexible hours, some weekends okay", scores: { hvac: 2, plumber: 2, mechanic: 2 } },
        { label: "Long shifts but more days off", scores: { welder: 1, cdl: 2 } },
        { label: "Irregular, travel-heavy schedule", scores: { cdl: 3 } },
      ],
    },
    {
      id: 4,
      question: "How do you feel about customer interaction?",
      options: [
        { label: "Love it, I'm good with people", scores: { hvac: 2, plumber: 2 } },
        { label: "Some is fine, but I prefer focusing on the work", scores: { electrician: 1, mechanic: 1 } },
        { label: "Minimal interaction preferred", scores: { welder: 2, carpenter: 1 } },
        { label: "Mostly solo, just me and the road/job", scores: { cdl: 2, welder: 1 } },
      ],
    },
    {
      id: 5,
      question: "How comfortable are you with math and measurements?",
      options: [
        { label: "Very comfortable, I like precision", scores: { electrician: 2, carpenter: 2 } },
        { label: "Pretty good, can handle it", scores: { hvac: 1, plumber: 1, mechanic: 1 } },
        { label: "Basic stuff is fine", scores: { welder: 1, cdl: 1 } },
      ],
    },
    {
      id: 6,
      question: "What's your approach to problem-solving?",
      options: [
        { label: "I like diagnosing and troubleshooting technical issues", scores: { electrician: 2, hvac: 2, mechanic: 2 } },
        { label: "I prefer following proven processes", scores: { plumber: 1, carpenter: 1 } },
        { label: "I'm creative and like figuring out custom solutions", scores: { welder: 2, carpenter: 2 } },
        { label: "I keep things simple and efficient", scores: { cdl: 2 } },
      ],
    },
    {
      id: 7,
      question: "How do you feel about working in extreme temperatures?",
      options: [
        { label: "I can handle heat or cold", scores: { hvac: 2, welder: 2, carpenter: 1 } },
        { label: "Prefer climate-controlled environments", scores: { electrician: 1, mechanic: 1 } },
        { label: "Heat is fine, cold not so much", scores: { welder: 1 } },
        { label: "Doesn't matter, I adapt", scores: { cdl: 1, plumber: 1 } },
      ],
    },
    {
      id: 8,
      question: "What's most important to you right now?",
      options: [
        { label: "Making good money fast", scores: { cdl: 2, welder: 1 } },
        { label: "Learning a solid trade with growth potential", scores: { electrician: 2, hvac: 2, plumber: 2 } },
        { label: "Job security and steady work", scores: { mechanic: 2, carpenter: 1 } },
        { label: "Freedom and flexibility", scores: { cdl: 2 } },
      ],
    },
    {
      id: 9,
      question: "Do you see yourself eventually running your own business?",
      options: [
        { label: "Yes, that's the goal", scores: { electrician: 2, hvac: 2, plumber: 2, carpenter: 2 } },
        { label: "Maybe, I'm open to it", scores: { mechanic: 1, welder: 1 } },
        { label: "Not really, I prefer working for a company", scores: { cdl: 1 } },
      ],
    },
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);

    // Update scores
    const selectedOption = questions[currentQuestion].options[optionIndex];
    const newScores = { ...scores };
    Object.entries(selectedOption.scores).forEach(([trade, points]) => {
      newScores[trade] = (newScores[trade] || 0) + points;
    });
    setScores(newScores);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Navigate to results
      navigate("/trade-quiz/results", { state: { scores } });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-1">
        

        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
             
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
                  <CardDescription>Choose the option that best describes you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={answers[currentQuestion]?.toString()}
                    onValueChange={(value) => handleAnswer(parseInt(value))}
                  >
                    {currentQ.options.map((option, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                        <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === undefined}
                      className="bg-accent hover:bg-accent/90"
                    >
                      {currentQuestion === questions.length - 1 ? "See Results" : "Next Question"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

            
            </div>
          </div>
        </section>

      </main>

      
    </div>
  );
};

export default TradeQuiz;
