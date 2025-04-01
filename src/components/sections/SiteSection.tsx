
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function SiteSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('site', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('lifestyle');
  };
  
  const handleNext = () => {
    setCurrentSection('architecture');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Site Information</h1>
        <p className="design-brief-section-description">
          Understanding your site helps us design a home that responds to its context and maximizes its potential.
        </p>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="existingConditions" className="design-brief-question-title">
              Existing Site Conditions
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the current state of the site or existing building. Include details about topography, vegetation, or existing structures.
            </p>
            <Textarea
              id="existingConditions"
              name="existingConditions"
              placeholder="Describe the current conditions of your site..."
              value={formData.site.existingConditions}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="siteFeatures" className="design-brief-question-title">
              Notable Site Features
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there special features you want to preserve or highlight? (e.g., trees, rock formations, water features)
            </p>
            <Textarea
              id="siteFeatures"
              name="siteFeatures"
              placeholder="Describe any special features of your site that you want to preserve or highlight..."
              value={formData.site.siteFeatures}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="viewsOrientations" className="design-brief-question-title">
              Views and Orientations
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What views would you like to capture? How does the sun move across your site? Any preferred orientations?
            </p>
            <Textarea
              id="viewsOrientations"
              name="viewsOrientations"
              placeholder="Describe the views, sun patterns, and desired orientations for your home..."
              value={formData.site.viewsOrientations}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="accessConstraints" className="design-brief-question-title">
              Access and Constraints
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there access challenges? Zoning restrictions? Heritage overlays? Known planning constraints?
            </p>
            <Textarea
              id="accessConstraints"
              name="accessConstraints"
              placeholder="Describe any access challenges or planning restrictions you're aware of..."
              value={formData.site.accessConstraints}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="neighboringProperties" className="design-brief-question-title">
              Neighboring Properties
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe neighboring buildings, privacy concerns, or relationships with adjoining properties.
            </p>
            <Textarea
              id="neighboringProperties"
              name="neighboringProperties"
              placeholder="Describe the surrounding properties and any privacy considerations..."
              value={formData.site.neighboringProperties}
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
            <span>Next: Architecture</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
