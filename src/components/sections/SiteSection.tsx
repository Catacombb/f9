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
            <Label htmlFor="siteDescription" className="design-brief-question-title">
              Site Description
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the general characteristics of the site (e.g., urban, suburban, rural, coastal).
            </p>
            <Textarea
              id="siteDescription"
              name="siteDescription"
              placeholder="Describe the site's general environment and setting..."
              value={formData.site.siteDescription}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="topography" className="design-brief-question-title">
              Topography
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the site's topography (e.g., flat, sloping, steep).
            </p>
            <Textarea
              id="topography"
              name="topography"
              placeholder="Describe the site's topography and any significant elevation changes..."
              value={formData.site.topography}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="vegetation" className="design-brief-question-title">
              Vegetation
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the existing vegetation on the site (e.g., trees, shrubs, grass).
            </p>
            <Textarea
              id="vegetation"
              name="vegetation"
              placeholder="Describe the site's vegetation and any significant trees or plants..."
              value={formData.site.vegetation}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="views" className="design-brief-question-title">
              Views
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the views from the site (e.g., ocean, mountains, city skyline).
            </p>
            <Textarea
              id="views"
              name="views"
              placeholder="Describe the views from the site and any significant landmarks..."
              value={formData.site.views}
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
