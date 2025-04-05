
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Mail, Check, Loader2, FileText } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { formatRoom, formatRoomDescription } from '@/utils/formatRoomData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function SummarySection() {
  const { 
    projectData, 
    formData, 
    files, 
    summary,
    updateSummary,
    currentSection, 
    setCurrentSection,
    saveProjectData,
    sendByEmail,
    exportAsPDF
  } = useDesignBrief();
  
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Use the project email if available
  useEffect(() => {
    if (formData.projectInfo.contactEmail) {
      setEmailInput(formData.projectInfo.contactEmail);
    }
  }, [formData.projectInfo.contactEmail]);
  
  // Generate rooms summary to display
  const formatRoomsForSummary = () => {
    const roomsByType: Record<string, any[]> = {};
    
    formData.spaces.rooms.forEach(room => {
      const roomType = room.displayName || (room.isCustom ? room.customName : room.type);
      
      if (!roomsByType[roomType]) {
        roomsByType[roomType] = [];
      }
      
      let description;
      try {
        if (room.description) {
          // Try to parse the description as JSON
          description = JSON.parse(room.description);
        }
      } catch (e) {
        description = { notes: room.description };
      }
      
      roomsByType[roomType].push({
        id: room.id,
        quantity: room.quantity,
        descriptions: description
      });
    });
    
    return roomsByType;
  };
  
  const roomsSummary = formatRoomsForSummary();
  
  // Format room descriptions for human-readable display
  const formatRoomDescriptions = (roomData: any) => {
    if (!roomData || !roomData.descriptions) return [];
    
    const descriptions = [];
    
    // Extract level information if it exists
    if (roomData.descriptions.level) {
      const levelText = roomData.descriptions.level === 'ground' 
        ? 'Ground floor' 
        : roomData.descriptions.level === 'upper' 
          ? 'Upper floor'
          : 'Either level';
      descriptions.push(levelText);
    }
    
    // Extract notes
    if (roomData.descriptions.notes && roomData.descriptions.notes.trim() !== '') {
      descriptions.push(roomData.descriptions.notes);
    }
    
    // Extract any other non-standard fields
    Object.entries(roomData.descriptions).forEach(([key, value]) => {
      if (key !== 'level' && key !== 'notes' && value) {
        if (typeof value === 'boolean' && value === true) {
          descriptions.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
        } else if (typeof value === 'string' && value !== '') {
          descriptions.push(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`);
        }
      }
    });
    
    return descriptions;
  };
  
  const handleSendEmail = async () => {
    // Validate email
    if (!emailInput.trim()) {
      setEmailError('Please enter an email address');
      return;
    }
    
    // Simple regex email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setSending(true);
    
    try {
      await saveProjectData();
      const success = await sendByEmail(emailInput);
      
      if (success) {
        toast.success("Design Brief has been sent successfully!");
      } else {
        toast.error("There was a problem sending the email. Please try again.");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Failed to send the email. Please try again later.");
    } finally {
      setSending(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      await saveProjectData();
      await exportAsPDF();
      toast.success("PDF has been generated and downloaded!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate the PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };
  
  const handleEditSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSummary({ executiveSummary: e.target.value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('communication');
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Summary & Export" 
          description="Review your design brief, edit the summary, and export or share it."
        />
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="export">Export & Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={summary.executiveSummary} 
                  onChange={handleEditSummary}
                  placeholder="Enter an executive summary for your design brief..."
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Project Name</TableCell>
                      <TableCell>{formData.projectInfo.clientName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Project Address</TableCell>
                      <TableCell>{formData.projectInfo.projectAddress}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Budget Range</TableCell>
                      <TableCell>{formData.budget.budgetRange}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Move-In Target</TableCell>
                      <TableCell>
                        {formData.projectInfo.moveInPreference === 'as_soon_as_possible'
                          ? 'As soon as possible'
                          : formData.projectInfo.moveInDate
                            ? new Date(formData.projectInfo.moveInDate).toLocaleDateString()
                            : 'Not specified'
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(roomsSummary).map(([roomType, rooms]) => (
                    <div key={roomType} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <h4 className="font-medium">
                        {roomType} ({rooms.reduce((acc, room) => acc + (room.quantity || 1), 0)})
                      </h4>
                      <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                        {rooms.map((room) => {
                          const descriptions = formatRoomDescriptions(room);
                          return descriptions.map((desc, idx) => (
                            <li key={`${room.id}-${idx}`}>{desc}</li>
                          ));
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Architectural Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.architecture.preferredStyles && formData.architecture.preferredStyles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Preferred Styles:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.architecture.preferredStyles.map((style) => (
                          <Badge key={style} variant="secondary">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.architecture.materialPreferences && formData.architecture.materialPreferences.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Material Preferences:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.architecture.materialPreferences.map((material) => (
                          <Badge key={material} variant="outline">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Download as PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Generate a comprehensive PDF report of your design brief that you can save and share.
                </p>
                <Button onClick={handleDownloadPDF} disabled={generating} className="w-full sm:w-auto">
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Download PDF Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Send by Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send the design brief as a PDF to yourself or your team.
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter email address"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                    />
                    {emailError && (
                      <p className="text-destructive text-sm">{emailError}</p>
                    )}
                  </div>
                  
                  <Button onClick={handleSendEmail} disabled={sending} className="w-full sm:w-auto">
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Design Brief
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Communication</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
