
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { Professional } from '@/types';

export function ContractorsSection() {
  const { setCurrentSection, updateFormData, formData, addProfessional, removeProfessional, updateProfessional } = useDesignBrief();
  const contractorsData = formData.contractors;
  
  const [newProfessionalType, setNewProfessionalType] = useState('');
  const [newProfessionalName, setNewProfessionalName] = useState('');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newProfessionalNotes, setNewProfessionalNotes] = useState('');
  
  const handlePrevious = () => {
    setCurrentSection('projectInfo');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('budget');
    window.scrollTo(0, 0);
  };

  const handleAddProfessional = () => {
    if (!newProfessionalType || !newProfessionalName) {
      toast.error("Please provide at least the professional type and name");
      return;
    }
    
    const professional = {
      type: newProfessionalType,
      name: newProfessionalName,
      businessName: newBusinessName,
      email: newEmail,
      phone: newPhone,
      website: newWebsite,
      notes: newProfessionalNotes,
      isCustom: false,
    };
    
    addProfessional(professional);
    
    // Clear form
    setNewProfessionalType('');
    setNewProfessionalName('');
    setNewBusinessName('');
    setNewEmail('');
    setNewPhone('');
    setNewWebsite('');
    setNewProfessionalNotes('');
    
    toast.success("Professional added");
  };
  
  const handleRemoveProfessional = (id: string) => {
    removeProfessional(id);
    toast.success("Professional removed");
  };
  
  const toggleWantF9Build = () => {
    updateFormData('contractors', { wantF9Build: !contractorsData.wantF9Build });
  };

  const toggleGoToTender = () => {
    updateFormData('contractors', { goToTender: !contractorsData.goToTender });
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Project Team" 
          description="Tell us about the professionals involved or that you'd like to work with on your project."
          isBold={true}
        />
        
        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="preferredBuilder" className="design-brief-question-title text-black font-bold">Preferred Builder</Label>
              <Input 
                id="preferredBuilder" 
                placeholder="e.g., Smith Construction, Inc." 
                value={contractorsData.preferredBuilder || ''} 
                onChange={(e) => updateFormData('contractors', { preferredBuilder: e.target.value })}
                className="text-black"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="wantF9Build" className="design-brief-question-title text-black font-bold">
                    I want F9 Productions to build my project
                  </Label>
                  <p className="text-sm text-black">Our design-build service provides seamless project delivery</p>
                </div>
                <Switch 
                  id="wantF9Build"
                  checked={!!contractorsData.wantF9Build}
                  onCheckedChange={toggleWantF9Build}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="goToTender" className="design-brief-question-title text-black font-bold">
                    I would like to tender for a builder
                  </Label>
                  <p className="text-sm text-black">We can help you find qualified builders</p>
                </div>
                <Switch 
                  id="goToTender"
                  checked={!!contractorsData.goToTender}
                  onCheckedChange={toggleGoToTender}
                />
              </div>
            </div>

            <Card className="border-blueprint-200">
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription className="text-black">
                  Add the professionals you're already working with or would like to include
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="professionalType" className="text-black font-medium">Professional Type</Label>
                    <Select value={newProfessionalType} onValueChange={setNewProfessionalType}>
                      <SelectTrigger id="professionalType" className="text-black">
                        <SelectValue placeholder="Select professional type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Architect">Architect</SelectItem>
                        <SelectItem value="Interior Designer">Interior Designer</SelectItem>
                        <SelectItem value="Landscape Architect">Landscape Architect</SelectItem>
                        <SelectItem value="Structural Engineer">Structural Engineer</SelectItem>
                        <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
                        <SelectItem value="MEP Engineer">MEP Engineer</SelectItem>
                        <SelectItem value="Builder">Builder</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="professionalName" className="text-black font-medium">Contact Person Name</Label>
                      <Input 
                        id="professionalName" 
                        value={newProfessionalName}
                        onChange={(e) => setNewProfessionalName(e.target.value)}
                        placeholder="e.g., John Smith"
                        className="text-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-black font-medium">Business Name</Label>
                      <Input 
                        id="businessName" 
                        value={newBusinessName}
                        onChange={(e) => setNewBusinessName(e.target.value)}
                        placeholder="e.g., Smith & Associates"
                        className="text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-black font-medium">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="e.g., john@smithassociates.com"
                        className="text-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-black font-medium">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="e.g., (303) 555-1234"
                        className="text-black"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-black font-medium">Website (Optional)</Label>
                    <Input 
                      id="website" 
                      type="url"
                      value={newWebsite}
                      onChange={(e) => setNewWebsite(e.target.value)}
                      placeholder="e.g., https://www.smithassociates.com"
                      className="text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalNotes" className="text-black font-medium">Notes</Label>
                    <Textarea 
                      id="professionalNotes" 
                      value={newProfessionalNotes}
                      onChange={(e) => setNewProfessionalNotes(e.target.value)}
                      placeholder="e.g., Already working with us on another project"
                      className="text-black"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddProfessional}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="font-bold">Add Professional</span>
                </Button>
              </CardFooter>
            </Card>
            
            {contractorsData.professionals.length > 0 && (
              <Card className="border-blueprint-200">
                <CardHeader>
                  <CardTitle>Added Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractorsData.professionals.map((professional) => (
                      <div key={professional.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-black">{professional.type}</h4>
                            <p className="text-black">{professional.name}</p>
                            {professional.businessName && (
                              <p className="text-black">{professional.businessName}</p>
                            )}
                            {(professional.email || professional.phone) && (
                              <p className="text-black">
                                {professional.email} {professional.email && professional.phone && '•'} {professional.phone}
                              </p>
                            )}
                            {professional.website && (
                              <p className="text-black">
                                <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">
                                  {professional.website.replace(/^https?:\/\//, '')}
                                </a>
                              </p>
                            )}
                            {professional.notes && (
                              <p className="text-black mt-2 italic">{professional.notes}</p>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-black hover:bg-red-100"
                            onClick={() => handleRemoveProfessional(professional.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group text-black">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Previous: Project Info</span>
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
