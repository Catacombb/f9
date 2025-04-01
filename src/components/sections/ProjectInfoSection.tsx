
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight } from 'lucide-react';

export function ProjectInfoSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('projectInfo', { [name]: value });
  };
  
  const handleProjectTypeChange = (value: string) => {
    updateFormData('projectInfo', { projectType: value });
  };
  
  const handleNext = () => {
    setCurrentSection('budget');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Project Information</h1>
        <p className="design-brief-section-description">
          Tell us about yourself and your project. This information helps us understand the basics of what you're looking to achieve.
        </p>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="clientName">Your Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Enter your full name"
              value={formData.projectInfo.clientName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="projectAddress">Project Address</Label>
            <Input
              id="projectAddress"
              name="projectAddress"
              placeholder="Enter the site address"
              value={formData.projectInfo.projectAddress}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="Your email address"
                value={formData.projectInfo.contactEmail}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="Your contact number"
                value={formData.projectInfo.contactPhone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="projectType">Project Type</Label>
            <Select 
              value={formData.projectInfo.projectType} 
              onValueChange={handleProjectTypeChange}
            >
              <SelectTrigger id="projectType" className="mt-1">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_build">New Build</SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="extension">Extension</SelectItem>
                <SelectItem value="interior_only">Interior Design Only</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="projectDescription">
              Project Description
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="projectDescription"
              name="projectDescription"
              placeholder="Briefly describe your project and what you hope to achieve..."
              value={formData.projectInfo.projectDescription}
              onChange={handleChange}
              className="mt-1 h-32"
            />
          </div>
        </div>
        
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
