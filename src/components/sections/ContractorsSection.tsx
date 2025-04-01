import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Professional } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Briefcase, User, X, Plus, Trash, Phone, Mail, FileText } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ContractorsSection() {
  const { formData, updateFormData, addProfessional, updateProfessional, removeProfessional } = useDesignBrief();
  const [showAddProfessional, setShowAddProfessional] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  
  // Predefined professional types
  const professionalTypes = [
    'Structural Engineer',
    'Surveyor',
    'Architect',
    'Landscape Designer',
    'Interior Designer',
    'Project Manager',
    'Quantity Surveyor',
    'Building Inspector',
    'Other'
  ];
  
  // Form for adding/editing professionals
  const professionalForm = useForm({
    defaultValues: {
      type: '',
      name: '',
      contact: '',
      notes: '',
      isCustom: false
    }
  });
  
  // Handler for builder/contractor fields
  const handleBuilderChange = (field: string, value: any) => {
    updateFormData('contractors', { [field]: value });
  };
  
  // Reset and show the add professional form
  const handleAddProfessional = () => {
    professionalForm.reset({
      type: 'Structural Engineer',
      name: '',
      contact: '',
      notes: '',
      isCustom: false
    });
    setEditingProfessional(null);
    setShowAddProfessional(true);
  };
  
  // Edit an existing professional
  const handleEditProfessional = (professional: Professional) => {
    professionalForm.reset({
      type: professional.type,
      name: professional.name,
      contact: professional.contact || '',
      notes: professional.notes || '',
      isCustom: professional.isCustom || false
    });
    setEditingProfessional(professional);
    setShowAddProfessional(true);
  };
  
  // Submit the professional form
  const handleProfessionalSubmit = (values: any) => {
    if (editingProfessional) {
      // Update existing professional
      updateProfessional({
        ...values,
        id: editingProfessional.id
      });
    } else {
      // Add new professional
      addProfessional(values);
    }
    setShowAddProfessional(false);
    setEditingProfessional(null);
    professionalForm.reset();
  };
  
  // Cancel adding/editing a professional
  const handleCancelProfessional = () => {
    setShowAddProfessional(false);
    setEditingProfessional(null);
    professionalForm.reset();
  };
  
  // Remove a professional
  const handleRemoveProfessional = (id: string) => {
    removeProfessional(id);
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-10rem)] px-4 py-6">
      <div className="container max-w-3xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Contractors</h1>
            <p className="text-muted-foreground">
              Specify preferred contractors and other professionals for your project.
            </p>
          </div>
          
          {/* Builder/Contractor Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Preferred Builder
              </CardTitle>
              <CardDescription>
                Specify your preferred builder or contractor for this project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Preferred Builder/Contractor</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter builder or contractor name" 
                      value={formData.contractors.preferredBuilder || ''}
                      onChange={(e) => handleBuilderChange('preferredBuilder', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
                
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Go to Tender</FormLabel>
                    <FormDescription>
                      Would you like to go to tender for the builder selection?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={formData.contractors.goToTender}
                      onCheckedChange={(checked) => handleBuilderChange('goToTender', checked)}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
          
          {/* Other Professionals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Other Professionals
              </CardTitle>
              <CardDescription>
                Specify other professionals involved in your project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* List of added professionals */}
              {formData.contractors.professionals && formData.contractors.professionals.length > 0 ? (
                <div className="space-y-3">
                  {formData.contractors.professionals.map((professional) => (
                    <div 
                      key={professional.id}
                      className="flex items-start justify-between p-3 border rounded-md"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{professional.type}</div>
                        <div>{professional.name}</div>
                        {professional.contact && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <Mail className="h-3 w-3 mr-1" />
                            {professional.contact}
                          </div>
                        )}
                        {professional.notes && (
                          <div className="text-sm text-muted-foreground flex items-start">
                            <FileText className="h-3 w-3 mr-1 mt-1" />
                            <span>{professional.notes}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditProfessional(professional)}
                        >
                          <User className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveProfessional(professional.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No professionals added yet.</p>
                </div>
              )}
              
              {/* Button to add a new professional */}
              {!showAddProfessional && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleAddProfessional}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Professional
                </Button>
              )}
              
              {/* Form to add/edit a professional */}
              {showAddProfessional && (
                <Card className="border-2 border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">
                      {editingProfessional ? 'Edit Professional' : 'Add Professional'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...professionalForm}>
                      <form onSubmit={professionalForm.handleSubmit(handleProfessionalSubmit)} className="space-y-4">
                        {/* Professional type selection */}
                        <FormItem>
                          <FormLabel>Professional Type</FormLabel>
                          <div className="space-y-2">
                            <ToggleGroup 
                              type="single" 
                              variant="outline"
                              className="flex flex-wrap justify-start"
                              value={professionalForm.watch('type')}
                              onValueChange={(value) => {
                                if (value) professionalForm.setValue('type', value);
                              }}
                            >
                              {professionalTypes.map((type) => (
                                <ToggleGroupItem key={type} value={type} className="mb-1 mr-1">
                                  {type}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                            
                            {professionalForm.watch('type') === 'Other' && (
                              <Input
                                placeholder="Specify other professional type"
                                value={professionalForm.watch('isCustom') ? professionalForm.watch('type') : ''}
                                onChange={(e) => {
                                  professionalForm.setValue('type', e.target.value);
                                  professionalForm.setValue('isCustom', true);
                                }}
                              />
                            )}
                          </div>
                        </FormItem>
                        
                        {/* Professional name */}
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Professional's name"
                              {...professionalForm.register('name')}
                            />
                          </FormControl>
                        </FormItem>
                        
                        {/* Contact information */}
                        <FormItem>
                          <FormLabel>Contact Information (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone number or email"
                              {...professionalForm.register('contact')}
                            />
                          </FormControl>
                        </FormItem>
                        
                        {/* Notes */}
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any specific preferences or notes about this professional"
                              {...professionalForm.register('notes')}
                              rows={3}
                            />
                          </FormControl>
                        </FormItem>
                        
                        {/* Form actions */}
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleCancelProfessional}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingProfessional ? 'Update' : 'Add'} Professional
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {/* Additional notes about professionals */}
              <div className="pt-4">
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about contractors or professionals..."
                      value={formData.contractors.additionalNotes || ''}
                      onChange={(e) => handleBuilderChange('additionalNotes', e.target.value)}
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
