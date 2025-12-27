import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import TradeSalaryCalculator from "./pages/TradeSalaryCalculator";
import CostOfLivingCalculator from "./pages/CostOfLivingCalculator";
import TravelVsLocalCalculator from "./pages/TravelVsLocalCalculator";
import TradeQuiz from "./pages/TradeQuiz";
import QuizResults from "./pages/QuizResults";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  // Detect if running in iframe and add class to prevent internal scrolling
  useEffect(() => {
    if (window.self !== window.top) {
      document.documentElement.classList.add('iframe-embedded');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trade-salary-calculator" element={<TradeSalaryCalculator />} />
            <Route path="/cost-of-living-calculator" element={<CostOfLivingCalculator />} />
            <Route path="/travel-vs-local-calculator" element={<TravelVsLocalCalculator />} />
            <Route path="/trade-quiz" element={<TradeQuiz />} />
            <Route path="/trade-quiz/results" element={<QuizResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
