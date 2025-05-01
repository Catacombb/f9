import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function SiteSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('site', { [name]: value });
  };

  const handlePrevious = () => {
    setCurrentSection('lifestyle');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Site Information"
          description="Tell us about the location of your project. Understanding the site helps us design a home that fits its environment."
        />

        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="existingConditions" className="design-brief-question-title">
              Existing Site Conditions
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the current state of the site. Is it vacant land, a teardown, or an existing building?
            </p>
            <Textarea
              id="existingConditions"
              name="existingConditions"
              placeholder="Describe the site's current state..."
              value={formData.site.existingConditions}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="siteFeaturesAndViews" className="design-brief-question-title">
              Site Features & Views
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What are the notable features of the site (trees, slopes, water)? What are the best views and which direction does the site face?
            </p>
            <Textarea
              id="siteFeaturesAndViews"
              name="siteFeaturesAndViews"
              placeholder="Describe any significant features, views, and orientation of the site..."
              value={formData.site.siteFeaturesAndViews || formData.site.siteFeatures || formData.site.viewsOrientations}
              onChange={(e) => {
                updateFormData('site', { 
                  siteFeaturesAndViews: e.target.value,
                  // Keep the old fields populated for backward compatibility
                  siteFeatures: e.target.value,
                  viewsOrientations: e.target.value
                });
              }}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="accessConstraints" className="design-brief-question-title">
              Site Access and Constraints
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there any challenges in accessing the site? Easements, setbacks, etc.?
            </p>
            <Textarea
              id="accessConstraints"
              name="accessConstraints"
              placeholder="Note any access issues or site constraints..."
              value={formData.site.accessConstraints}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="neighboringProperties" className="design-brief-question-title">
              Neighboring Properties
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the surrounding properties. Residential, commercial, busy street, etc.?
            </p>
            <Textarea
              id="neighboringProperties"
              name="neighboringProperties"
              placeholder="Describe the neighboring properties..."
              value={formData.site.neighboringProperties}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="siteNotes" className="design-brief-question-title">
              Additional Site Notes
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="siteNotes"
              name="siteNotes"
              placeholder="Any other important information about the site..."
              value={formData.site.siteNotes}
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
