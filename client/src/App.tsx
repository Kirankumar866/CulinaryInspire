import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import PortfolioDetail from "@/pages/portfolio-detail";
import CaseStudyDetail from "@/pages/case-study-detail";
import CaseStudies from "@/pages/case-studies";
import AiTools from "@/pages/ai-tools";
import Community from "@/pages/community";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio/:id" component={PortfolioDetail} />
      <Route path="/case-study/:id" component={CaseStudyDetail} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/ai-tools" component={AiTools} />
      <Route path="/community" component={Community} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
