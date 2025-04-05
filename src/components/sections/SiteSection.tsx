
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

// Options for site features and constraints
const siteFeatureOptions = [
  'Flat land', 'Sloping site', 'Waterfront', 'Bush setting',
  'Urban setting', 'Rural setting', 'Mountain views', 'Sea views',
  'Garden established', 'North facing', 'South facing', 'East facing', 'West facing'
];

const siteConstraintOptions = [
  'Heritage constraints', 'Flood zone', 'Bush fire zone', 'Height restrictions',
  'Boundary setbacks', 'Overshadowing issues', 'Noise issues', 'Privacy issues',
  'Limited access', 'Easements', 'Covenants', 'Protected trees'
];

export function SiteSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleSiteFeaturesChange = (features: string[]) => {
    updateFormData('site', { siteFeatures: features });
  };
  
  const handleSiteConstraintsChange = (constraints: string[]) => {
    updateFormData('site', { siteConstraints: constraints });
  };
  
  const handlePrevious = () => {
    // Navigation to previous section
    setCurrentSection('lifestyle');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    // Navigation to next section
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Site Information" 
          description="Tell us about your site, its characteristics, and any constraints."
          isBold={true}
        />
        
        <Card className="mb-8">
          <CardContent className="pt-6 space-y-8">
            <div>
              <Label htmlFor="existingConditions" className="text-base font-medium">
                Existing Conditions
              </Label>
              <div className="text-sm text-slate-500 mb-2">
                What is currently on the site? (e.g., empty lot, existing house to be demolished)
              </div>
              <Textarea
                id="existingConditions"
                placeholder="Describe the current state of your site..."
                value={formData.site.existingConditions || ''}
                onChange={(e) => updateFormData('site', { existingConditions: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label className="text-base font-medium">Site Features</Label>
              <div className="text-sm text-slate-500 mb-2">
                Select the features that describe your site
              </div>
              <MultiSelectButtons
                options={siteFeatureOptions}
                selected={Array.isArray(formData.site.siteFeatures) ? formData.site.siteFeatures : []}
                onChange={handleSiteFeaturesChange}
                allowMultiple={true}
              />
            </div>
            
            <div>
              <Label className="text-base font-medium">Site Constraints</Label>
              <div className="text-sm text-slate-500 mb-2">
                Select any known constraints for your site
              </div>
              <MultiSelectButtons
                options={siteConstraintOptions}
                selected={formData.site.siteConstraints || []}
                onChange={handleSiteConstraintsChange}
                allowMultiple={true}
              />
            </div>
            
            <div>
              <Label htmlFor="viewsOrientations" className="text-base font-medium">
                Views and Orientation
              </Label>
              <div className="text-sm text-slate-500 mb-2">
                Describe the best views from your site and sun orientation
              </div>
              <Textarea
                id="viewsOrientations"
                placeholder="e.g., Best views are to the north, morning sun in the east..."
                value={formData.site.viewsOrientations || ''}
                onChange={(e) => updateFormData('site', { viewsOrientations: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="accessConstraints" className="text-base font-medium">
                Access and Constraints
              </Label>
              <div className="text-sm text-slate-500 mb-2">
                Describe access to the site and any limitations
              </div>
              <Textarea
                id="accessConstraints"
                placeholder="e.g., Steep driveway, limited street frontage..."
                value={formData.site.accessConstraints || ''}
                onChange={(e) => updateFormData('site', { accessConstraints: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="neighboringProperties" className="text-base font-medium">
                Neighboring Properties
              </Label>
              <div className="text-sm text-slate-500 mb-2">
                Describe neighboring properties and any considerations
              </div>
              <Textarea
                id="neighboringProperties"
                placeholder="e.g., Two-story house to the north, commercial property to the west..."
                value={formData.site.neighboringProperties || ''}
                onChange={(e) => updateFormData('site', { neighboringProperties: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="siteNotes" className="text-base font-medium">
                Additional Site Notes
              </Label>
              <div className="text-sm text-slate-500 mb-2">
                Any other important information about your site
              </div>
              <Textarea
                id="siteNotes"
                placeholder="e.g., Soil conditions, drainage issues, specific council requirements..."
                value={formData.site.siteNotes || ''}
                onChange={(e) => updateFormData('site', { siteNotes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
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
