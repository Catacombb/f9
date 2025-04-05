
// Implementation for Previous/Next buttons in BudgetSection.tsx
// Assuming this code would be part of the existing BudgetSection component

const handlePrevious = () => {
  setCurrentSection('contractors');
  window.scrollTo(0, 0);
};

const handleNext = () => {
  setCurrentSection('communication');
  window.scrollTo(0, 0);
};

// Then in the JSX:
<div className="flex justify-between mt-6">
  <Button variant="outline" onClick={handlePrevious} className="group">
    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
    <span>Previous: Project Team</span>
  </Button>
  
  <Button onClick={handleNext} className="group">
    <span>Next: Communication</span>
    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
  </Button>
</div>
