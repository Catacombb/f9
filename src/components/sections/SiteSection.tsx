
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function SiteSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('site', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('lifestyle');
  };
  
  const handleNext = () => {
    setCurrentSection('spaces');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Site Information" 
          description="Understanding your site helps us design with the natural environment and surroundings in mind."
          isBold={true}
        />
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="existingConditions" className="design-brief-question-title font-bold">
              Site Description
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the general characteristics of the site (e.g., urban, suburban, rural, coastal).
            </p>
            <Textarea
              id="existingConditions"
              name="existingConditions"
              placeholder="Describe the site's general environment and setting..."
              value={formData.site.existingConditions}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="siteFeatures" className="design-brief-question-title font-bold">
              Topography
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the site's topography (e.g., flat, sloping, steep).
            </p>
            <Textarea
              id="siteFeatures"
              name="siteFeatures"
              placeholder="Describe the site's topography and any significant elevation changes..."
              value={formData.site.siteFeatures}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="neighboringProperties" className="design-brief-question-title font-bold">
              Vegetation
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the existing vegetation on the site (e.g., trees, shrubs, grass).
            </p>
            <Textarea
              id="neighboringProperties"
              name="neighboringProperties"
              placeholder="Describe the site's vegetation and any significant trees or plants..."
              value={formData.site.neighboringProperties}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="viewsOrientations" className="design-brief-question-title font-bold">
              Views
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the views from the site (e.g., ocean, mountains, city skyline).
            </p>
            <Textarea
              id="viewsOrientations"
              name="viewsOrientations"
              placeholder="Describe the views from the site and any significant landmarks..."
              value={formData.site.viewsOrientations}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Lifestyle</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Spaces</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
