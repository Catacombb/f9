
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ContractorsSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const [tabState, setTabState] = useState('general');

  const handlePrevious = () => {
    setCurrentSection('architecture');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('budget');
    window.scrollTo(0, 0);
  };

  const handleGoToTenderChange = (value: string) => {
    updateFormData('contractors', { goToTender: value === 'yes' });
  };

  const handleF9BuildChange = (value: string) => {
    updateFormData('contractors', { f9Build: value === 'yes' });
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Project Team"
          description="Share your preferences regarding builders and contractors for your project."
          isBold={true}
        />

        <div className="design-brief-form-group">
          <div className="text-center mb-4">
            <Button 
              variant="outline" 
              className="border-green-300 hover:bg-green-50 hover:border-green-400 font-medium"
              onClick={() => window.open("https://f9productions.com/about/", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Meet the F9 Team
            </Button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="design-brief-question-title">
                Would you like F9 Productions to build your project?
              </Label>
              <p className="design-brief-question-description mb-2">
                We offer full design-build services and can manage your project from start to finish.
              </p>
              <RadioGroup
                value={formData.contractors.f9Build ? 'yes' : 'no'}
                onValueChange={handleF9BuildChange}
                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="f9Build-yes" />
                  <Label htmlFor="f9Build-yes">Yes, I want F9 Productions to build my project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="f9Build-no" />
                  <Label htmlFor="f9Build-no">No, I have other plans</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="design-brief-question-title">
                Would you like to tender for a builder?
              </Label>
              <p className="design-brief-question-description mb-2">
                We can help you find and evaluate potential builders.
              </p>
              <RadioGroup
                value={formData.contractors.goToTender ? 'yes' : 'no'}
                onValueChange={handleGoToTenderChange}
                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="goToTender-yes" />
                  <Label htmlFor="goToTender-yes">Yes, I'd like to tender</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="goToTender-no" />
                  <Label htmlFor="goToTender-no">No, I already have a builder</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.contractors.goToTender === false && (
              <div className="space-y-2">
                <Label htmlFor="preferredBuilder" className="design-brief-question-title">
                  Preferred Builder
                </Label>
                <p className="design-brief-question-description">
                  If you already have a preferred builder, please provide their name and contact information.
                </p>
                <Input
                  id="preferredBuilder"
                  placeholder="Builder name and contact information"
                  value={formData.contractors.preferredBuilder || ''}
                  onChange={(e) => updateFormData('contractors', { preferredBuilder: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="structuralEngineer" className="design-brief-question-title">
                Structural Engineer
                <span className="text-muted-foreground text-sm ml-2">(optional)</span>
              </Label>
              <p className="design-brief-question-description">
                If you have a preferred structural engineer, please specify.
              </p>
              <Input
                id="structuralEngineer"
                placeholder="Structural engineer name and contact information"
                value={formData.contractors.structuralEngineer || ''}
                onChange={(e) => updateFormData('contractors', { structuralEngineer: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="civilEngineer" className="design-brief-question-title">
                Civil Engineer
                <span className="text-muted-foreground text-sm ml-2">(optional)</span>
              </Label>
              <p className="design-brief-question-description">
                If you have a preferred civil engineer, please specify.
              </p>
              <Input
                id="civilEngineer"
                placeholder="Civil engineer name and contact information"
                value={formData.contractors.civilEngineer || ''}
                onChange={(e) => updateFormData('contractors', { civilEngineer: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherConsultants" className="design-brief-question-title">
                Other Consultants
                <span className="text-muted-foreground text-sm ml-2">(optional)</span>
              </Label>
              <p className="design-brief-question-description">
                Are there other consultants you'd like to work with? Please list them here.
              </p>
              <Textarea
                id="otherConsultants"
                placeholder="Other consultants you'd like to work with"
                value={formData.contractors.otherConsultants || ''}
                onChange={(e) => updateFormData('contractors', { otherConsultants: e.target.value })}
                className="min-h-20"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Previous: Architecture</span>
          </Button>

          <Button onClick={handleNext} className="group bg-yellow-500 hover:bg-yellow-600 text-black">
            <span className="font-bold">Next: Budget</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
