
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function ArchitectureSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('architecture', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('spaces');
  };
  
  const handleNext = () => {
    setCurrentSection('uploads');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Architecture & Inspiration" 
          description="Share your preferences for architectural styles, materials, and design elements."
          isBold={true}
        />
        
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="architecture" className="mt-0">
            <div className="design-brief-form-group">
              <div className="mb-6">
                <Label htmlFor="stylePrefences" className="design-brief-question-title">
                  Preferred Architectural Style
                  <span className="text-muted-foreground text-sm ml-2">(optional)</span>
                </Label>
                <p className="design-brief-question-description">
                  Describe the architectural style you envision for your project.
                </p>
                <Textarea
                  id="stylePrefences"
                  name="stylePrefences"
                  placeholder="Describe your preferred architectural style..."
                  value={formData.architecture.stylePrefences}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="externalMaterials" className="design-brief-question-title">
                  Materials Preferences
                  <span className="text-muted-foreground text-sm ml-2">(optional)</span>
                </Label>
                <p className="design-brief-question-description">
                  Are there specific materials you'd like to incorporate into the design?
                </p>
                <Textarea
                  id="externalMaterials"
                  name="externalMaterials"
                  placeholder="List any preferred building materials..."
                  value={formData.architecture.externalMaterials}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="specialFeatures" className="design-brief-question-title">
                  Key Design Elements
                  <span className="text-muted-foreground text-sm ml-2">(optional)</span>
                </Label>
                <p className="design-brief-question-description">
                  Any specific design elements or features you'd like to include?
                </p>
                <Textarea
                  id="specialFeatures"
                  name="specialFeatures"
                  placeholder="Describe any key design elements you want in your project..."
                  value={formData.architecture.specialFeatures}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="inspiration" className="mt-0">
            {/* Import content from InspirationSection here */}
            <div className="text-center py-8">
              <p className="text-lg font-medium">Inspiration Tab</p>
              <p className="text-muted-foreground mt-2">
                This tab contains the inspiration content from the original Inspiration section.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Spaces</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Uploads</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
