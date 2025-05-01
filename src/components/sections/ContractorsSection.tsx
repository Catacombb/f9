
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';

export function ContractorsSection() {
  const { updateFormData, formData, setCurrentSection } = useDesignBrief();
  const contractors = formData.contractors;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('contractors', { [field]: value });
  };
  
  // Add this new function to open the F9 team page
  const openF9TeamPage = () => {
    window.open('https://f9productions.com/team', '_blank');
  };
  
  // Add this new function to navigate to the budget section
  const handleNext = () => {
    setCurrentSection('budget');
    window.scrollTo(0, 0);
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <div className="flex justify-between items-center mb-4">
          <SectionHeader 
            title="Project Team" 
            description="Provide information about the professionals involved in your project."
          />
          <Button
            onClick={openF9TeamPage}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Meet the F9 Team
          </Button>
        </div>
      
        {/* F9 As Builder Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="wantF9Build" className="text-base font-medium mb-2 block">
                  Would you like F9 Productions to build your project?
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  F9 Productions is a design-build firm that can streamline the entire process from design to construction.
                </p>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <RadioGroup
                      value={contractors.wantF9Build ? 'yes' : 'no'}
                      onValueChange={(value) => {
                        updateFormData('contractors', { wantF9Build: value === 'yes' });
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="f9-yes" />
                        <Label htmlFor="f9-yes">Yes – I want F9 to build my project</Label>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="no" id="f9-no" />
                        <Label htmlFor="f9-no">No – I'll use another builder or decide later</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Only show these sections if F9 is not selected as builder */}
        {!contractors.wantF9Build && (
          <>
            {/* Tender Selection */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goToTender" className="text-base font-medium mb-2 block">
                      Would you like the project to go to tender with multiple builders?
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Going to tender means getting quotes from multiple builders to compare prices and services.
                    </p>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <RadioGroup
                          value={contractors.goToTender ? 'yes' : 'no'}
                          onValueChange={(value) => {
                            updateFormData('contractors', { goToTender: value === 'yes' });
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="tender-yes" />
                            <Label htmlFor="tender-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <RadioGroupItem value="no" id="tender-no" />
                            <Label htmlFor="tender-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Preferred Builder */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preferredBuilder" className="text-base font-medium mb-2 block">
                      Do you have a preferred builder?
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you already have a builder in mind, please provide their details below.
                    </p>
                    <Textarea
                      id="preferredBuilder"
                      value={contractors.preferredBuilder || ''}
                      onChange={(e) => handleInputChange('preferredBuilder', e.target.value)}
                      placeholder="Builder name and contact information"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Consultant Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="structuralEngineer" className="text-base font-medium mb-2 block">
                  Structural Engineer
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have a structural engineer in mind, please provide their details below.
                </p>
                <Textarea
                  id="structuralEngineer"
                  value={contractors.structuralEngineer || ''}
                  onChange={(e) => handleInputChange('structuralEngineer', e.target.value)}
                  placeholder="Engineer name and contact information"
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="civilEngineer" className="text-base font-medium mb-2 block">
                  Civil Engineer
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have a civil engineer in mind, please provide their details below.
                </p>
                <Textarea
                  id="civilEngineer"
                  value={contractors.civilEngineer || ''}
                  onChange={(e) => handleInputChange('civilEngineer', e.target.value)}
                  placeholder="Engineer name and contact information"
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="otherConsultants" className="text-base font-medium mb-2 block">
                  Other Consultants
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Please provide details of any other consultants involved in the project.
                </p>
                <Textarea
                  id="otherConsultants"
                  value={contractors.otherConsultants || ''}
                  onChange={(e) => handleInputChange('otherConsultants', e.target.value)}
                  placeholder="Consultant name and contact information"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Add the "Next Section" button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleNext} className="group">
            <span>Next: Budget</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
