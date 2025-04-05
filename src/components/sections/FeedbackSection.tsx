
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleRatingChange = (field: string, value: number) => {
    updateFormData('feedback', { [field]: value });
  };
  
  const handleTextChange = (field: string, value: string) => {
    updateFormData('feedback', { [field]: value });
  };
  
  const handleNext = () => {
    // Validate required fields
    if (
      !formData.feedback.usabilityRating ||
      !formData.feedback.performanceRating ||
      !formData.feedback.functionalityRating ||
      !formData.feedback.designRating ||
      !formData.feedback.feedbackComments
    ) {
      toast.error("Please complete all required fields before proceeding");
      return;
    }
    
    setCurrentSection('summary');
  };
  
  const handlePrevious = () => {
    setCurrentSection('uploads');
  };
  
  const RatingStars = ({ 
    name, 
    value, 
    onChange 
  }: { 
    name: string; 
    value: number; 
    onChange: (value: number) => void 
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full`}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Feedback"
          description="Help us improve our design brief tool with your feedback."
        />
        
        <Card className="bg-gradient-to-b from-amber-50 to-white border-amber-200">
          <CardContent className="p-6 space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-yellow-800">Please Rate Your Experience (1-5 stars)</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="usabilityRating" className="font-medium">Usability Rating*</Label>
                  <RatingStars 
                    name="usabilityRating" 
                    value={formData.feedback.usabilityRating} 
                    onChange={(v) => handleRatingChange('usabilityRating', v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="performanceRating" className="font-medium">Performance Rating*</Label>
                  <RatingStars 
                    name="performanceRating" 
                    value={formData.feedback.performanceRating} 
                    onChange={(v) => handleRatingChange('performanceRating', v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="functionalityRating" className="font-medium">Functionality Rating*</Label>
                  <RatingStars 
                    name="functionalityRating" 
                    value={formData.feedback.functionalityRating} 
                    onChange={(v) => handleRatingChange('functionalityRating', v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="designRating" className="font-medium">Design Rating*</Label>
                  <RatingStars 
                    name="designRating" 
                    value={formData.feedback.designRating} 
                    onChange={(v) => handleRatingChange('designRating', v)} 
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="feedbackComments" className="font-medium">Feedback Comments*</Label>
                <div className="text-sm text-muted-foreground mt-1 mb-2">
                  Please share your thoughts about the design brief tool.
                </div>
                <Textarea
                  id="feedbackComments"
                  value={formData.feedback.feedbackComments}
                  onChange={(e) => handleTextChange('feedbackComments', e.target.value)}
                  placeholder="What worked well? What could be improved?"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <Separator className="bg-amber-200" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-yellow-800">
                Interested in a Custom Version of Northstar?
              </h3>
              
              <div className="text-sm text-muted-foreground">
                Would you like a tailored version of this tool for your firm or workflow?
              </div>
              
              <div>
                <Label htmlFor="customVersionInterest" className="font-medium">
                  What would you want to customize or build?
                </Label>
                <Textarea
                  id="customVersionInterest"
                  value={formData.feedback.customVersionInterest}
                  onChange={(e) => handleTextChange('customVersionInterest', e.target.value)}
                  placeholder="Describe your customization interests..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="w-[100px]"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="w-[100px] bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
