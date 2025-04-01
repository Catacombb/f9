
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from './SectionHeader';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Professional } from '@/types';

export function ContractorsSection() {
  const { formData, updateFormData, addProfessional, updateProfessional, removeProfessional, setCurrentSection } = useDesignBrief();
  const [newProfessional, setNewProfessional] = useState<Omit<Professional, 'id'>>({
    type: '',
    name: '',
    contact: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('new_')) {
      const field = name.replace('new_', '');
      setNewProfessional(prev => ({ ...prev, [field]: value }));
    } else {
      updateFormData('contractors', { [name]: value });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    updateFormData('contractors', { goToTender: checked });
  };

  const handleAddProfessional = () => {
    if (newProfessional.type && newProfessional.name) {
      addProfessional({
        ...newProfessional,
        id: crypto.randomUUID(),
      });
      
      // Reset form
      setNewProfessional({
        type: '',
        name: '',
        contact: '',
        notes: '',
      });
    }
  };

  const handleRemoveProfessional = (id: string) => {
    removeProfessional(id);
  };

  const handleProfessionalChange = (id: string, field: string, value: string) => {
    const professional = formData.contractors.professionals.find(p => p.id === id);
    if (professional) {
      updateProfessional({
        ...professional,
        [field]: value,
      });
    }
  };
  
  const handlePrevious = () => {
    setCurrentSection('projectInfo');
  };
  
  const handleNext = () => {
    setCurrentSection('budget');
  };
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const requiredFields = 2; // preferredBuilder and at least one professional
    
    if (formData.contractors.preferredBuilder) completed++;
    if (formData.contractors.professionals && formData.contractors.professionals.length > 0) completed++;
    
    return Math.round((completed / requiredFields) * 100);
  };
  
  const completionPercentage = calculateCompletion();

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <div className="flex justify-between items-center mb-4">
          <SectionHeader 
            title="Project Team" 
            description="Tell us about the professionals you'd like to work with on your project." 
          />
          <div className="text-sm font-medium">
            {completionPercentage}% Complete
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="preferredBuilder">Preferred Builder</Label>
            <Input
              id="preferredBuilder"
              name="preferredBuilder"
              placeholder="Enter the name of your preferred builder (if any)"
              value={formData.contractors.preferredBuilder}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6 flex items-center space-x-2">
            <Switch
              id="goToTender"
              checked={formData.contractors.goToTender}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="goToTender">I would like to go to tender for a builder</Label>
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <h3 className="text-lg font-semibold mb-4">Other Professionals</h3>
          
          {formData.contractors.professionals.map((professional) => (
            <Card key={professional.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium">{professional.type || 'Professional'}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveProfessional(professional.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-4 mb-2">
                  <div>
                    <Label htmlFor={`name_${professional.id}`}>Name</Label>
                    <Input
                      id={`name_${professional.id}`}
                      value={professional.name}
                      onChange={(e) => handleProfessionalChange(professional.id, 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`contact_${professional.id}`}>Contact Info</Label>
                    <Input
                      id={`contact_${professional.id}`}
                      value={professional.contact || ''}
                      onChange={(e) => handleProfessionalChange(professional.id, 'contact', e.target.value)}
                      className="mt-1"
                      placeholder="Email or phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`notes_${professional.id}`}>Notes</Label>
                    <Textarea
                      id={`notes_${professional.id}`}
                      value={professional.notes || ''}
                      onChange={(e) => handleProfessionalChange(professional.id, 'notes', e.target.value)}
                      className="mt-1"
                      placeholder="Any additional information"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="mb-4 border-dashed">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-4">Add New Professional</h4>
              
              <div className="grid gap-4 mb-4">
                <div>
                  <Label htmlFor="new_type">Type of Professional</Label>
                  <Input
                    id="new_type"
                    name="new_type"
                    value={newProfessional.type}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., Structural Engineer, Interior Designer"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new_name">Name</Label>
                  <Input
                    id="new_name"
                    name="new_name"
                    value={newProfessional.name}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Professional's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new_contact">Contact Info</Label>
                  <Input
                    id="new_contact"
                    name="new_contact"
                    value={newProfessional.contact}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Email or phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new_notes">Notes</Label>
                  <Textarea
                    id="new_notes"
                    name="new_notes"
                    value={newProfessional.notes}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Any additional information"
                  />
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleAddProfessional}
                disabled={!newProfessional.type || !newProfessional.name}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Professional</span>
              </Button>
            </CardContent>
          </Card>
          
          <div>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Any other information about your project team..."
              value={formData.contractors.additionalNotes || ''}
              onChange={handleInputChange}
              className="mt-1 h-32"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Project Info</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Budget</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
