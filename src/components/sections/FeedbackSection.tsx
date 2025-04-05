
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Star, TestTube, MessageSquare, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import emailjs from 'emailjs-com';

export function FeedbackSection() {
  const { formData, updateFormData, setCurrentSection, projectData } = useDesignBrief();
  const [otherRole, setOtherRole] = useState(
    formData.feedback.userRole?.includes('Other') 
      ? formData.feedback.otherRoleSpecify || '' 
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testerName, setTesterName] = useState('');
  const [testerEmail, setTesterEmail] = useState('');
  
  const handleRatingChange = (field: string, value: number) => {
    updateFormData('feedback', { [field]: value });
  };
  
  const handleTextChange = (field: string, value: string) => {
    updateFormData('feedback', { [field]: value });
  };
  
  const handleRoleSelection = (role: string) => {
    const currentRoles = formData.feedback.userRole || [];
    let newRoles = [...currentRoles];
    
    if (currentRoles.includes(role)) {
      newRoles = newRoles.filter(item => item !== role);
    } else {
      newRoles.push(role);
    }
    
    updateFormData('feedback', { userRole: newRoles });
  };
  
  const sendFeedbackEmail = async () => {
    try {
      // Get client info from project data or use tester provided values
      const clientInfo = projectData?.formData?.projectInfo || {
        clientName: '',
        contactEmail: ''
      };
      
      const templateParams = {
        to_email: 'nick@nickharrison.co',
        from_name: testerName || clientInfo.clientName || 'Anonymous Tester',
        from_email: testerEmail || clientInfo.contactEmail || 'No Email Provided',
        subject: 'Northstar Design Brief - Tester Feedback',
        message: `
— Tester Feedback —
Submitted by: ${testerName || clientInfo.clientName || 'Anonymous'} (${testerEmail || clientInfo.contactEmail || 'No Email'})

RATINGS:
Usability: ${formData.feedback.usabilityRating}/5
Performance: ${formData.feedback.performanceRating}/5
Functionality: ${formData.feedback.functionalityRating}/5
Design: ${formData.feedback.designRating}/5

FEEDBACK:
What they liked most: "${formData.feedback.likeMost}"
Frustrations/Unclear aspects: "${formData.feedback.improvements}"
Requested features: "${formData.feedback.nextFeature}"
Additional feedback: "${formData.feedback.additionalFeedback}"

CUSTOM VERSION INTEREST:
Interested in custom version: ${formData.feedback.customVersionInterest ? 'Yes' : 'No'}
Details: "${formData.feedback.customVersionInterest}"

USER CONTEXT:
Role: ${formData.feedback.userRole?.join(', ') || 'Not specified'}
${formData.feedback.userRole?.includes('Other') ? `Other role: ${formData.feedback.otherRoleSpecify}` : ''}
Team size: ${formData.feedback.teamSize || 'Not specified'}

FOLLOW-UP:
Would recommend: ${formData.feedback.wouldRecommend || 'Not specified'}
Can contact: ${formData.feedback.canContact || 'No'}
        `
      };

      // Send email using your EmailJS credentials
      await emailjs.send(
        'service_94y36iq', // Your EmailJS service ID needed here
        'template_l4lrz4g', // Your provided template ID
        templateParams,
        'UTp_oJDgVq3AxICn0' // Your public key
      );
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };
  
  const handleNext = async () => {
    // Validate required fields
    if (
      !formData.feedback.usabilityRating ||
      !formData.feedback.performanceRating ||
      !formData.feedback.functionalityRating ||
      !formData.feedback.designRating ||
      !formData.feedback.likeMost ||
      !formData.feedback.improvements ||
      !formData.feedback.nextFeature ||
      !formData.feedback.additionalFeedback ||
      !formData.feedback.userRole ||
      formData.feedback.userRole.length === 0 ||
      !formData.feedback.teamSize ||
      !formData.feedback.wouldRecommend
    ) {
      toast.error("Please complete all required fields before proceeding");
      return;
    }
    
    // If "Other" role is selected but not specified
    if (formData.feedback.userRole.includes('Other') && !otherRole) {
      toast.error("Please specify your role");
      return;
    }
    
    setIsSubmitting(true);
    
    // Try to send the feedback email
    const emailSuccess = await sendFeedbackEmail();
    
    setIsSubmitting(false);
    
    if (emailSuccess) {
      toast.success("Thank you for your feedback! It has been submitted successfully.");
    } else {
      toast.warning("Your feedback was saved but we couldn't send the notification email. The team will still receive your feedback.");
    }
    
    // Navigate back to summary
    setCurrentSection('summary');
  };
  
  const handlePrevious = () => {
    setCurrentSection('summary');
  };
  
  const RatingStars = ({ 
    name, 
    value, 
    onChange 
  }: { 
    name: string; 
    value: number; 
    onChange: (value: number) => void 
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full`}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Feedback for Testers"
          description="Help us improve the design brief tool by providing your feedback. This section is for testers only and won't be included in the final version."
          icon={<TestTube className="h-6 w-6 text-purple-600" />}
        />
        
        <Card className="bg-gradient-to-b from-purple-50 to-white border-purple-200">
          <CardContent className="p-6 space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-purple-800 flex items-center gap-2">
                <User className="h-5 w-5" /> 
                Tester Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testerName" className="font-medium">Your Name</Label>
                  <Input
                    id="testerName"
                    value={testerName}
                    onChange={(e) => setTesterName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testerEmail" className="font-medium">Your Email</Label>
                  <Input
                    id="testerEmail"
                    type="email"
                    value={testerEmail}
                    onChange={(e) => setTesterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                This information will be used to track who provided feedback and may be used for follow-up questions.
              </div>
            </div>
            
            <Separator className="bg-purple-100" />
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-purple-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> 
                Please Rate Your Experience (1-5 stars)
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="usabilityRating" className="font-medium">Usability Rating*</Label>
                  <RatingStars 
                    name="usabilityRating" 
                    value={formData.feedback.usabilityRating} 
                    onChange={(v) => handleRatingChange('usabilityRating', v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="performanceRating" className="font-medium">Performance Rating*</Label>
                  <RatingStars 
                    name="performanceRating" 
                    value={formData.feedback.performanceRating} 
                    onChange={(v) => handleRatingChange('performanceRating', v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="functionalityRating" className="font-medium">Functionality Rating*</Label>
                  <RatingStars 
                    name="functionalityRating" 
                    value={formData.feedback.functionalityRating} 
                    onChange={(v) => handleRatingChange('functionalityRating', v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="designRating" className="font-medium">Design Rating*</Label>
                  <RatingStars 
                    name="designRating" 
                    value={formData.feedback.designRating} 
                    onChange={(v) => handleRatingChange('designRating', v)} 
                  />
                </div>
              </div>
            </div>
            
            <Separator className="bg-purple-100" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-purple-800">Open Text Feedback</h3>
              
              <div className="pt-2">
                <Label htmlFor="likeMost" className="font-medium">What did you like most about this tool?*</Label>
                <div className="text-sm text-muted-foreground mt-1 mb-2">
                  Please share your thoughts about the design brief tool.
                </div>
                <Textarea
                  id="likeMost"
                  value={formData.feedback.likeMost || ''}
                  onChange={(e) => handleTextChange('likeMost', e.target.value)}
                  placeholder="I really liked..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="pt-2">
                <Label htmlFor="improvements" className="font-medium">Was anything unclear, frustrating, or unnecessary?*</Label>
                <Textarea
                  id="improvements"
                  value={formData.feedback.improvements || ''}
                  onChange={(e) => handleTextChange('improvements', e.target.value)}
                  placeholder="I found this confusing..."
                  className="min-h-[100px] mt-2"
                />
              </div>
              
              <div className="pt-2">
                <Label htmlFor="nextFeature" className="font-medium">What feature or improvement would you love to see next?*</Label>
                <Textarea
                  id="nextFeature"
                  value={formData.feedback.nextFeature || ''}
                  onChange={(e) => handleTextChange('nextFeature', e.target.value)}
                  placeholder="It would be great if..."
                  className="min-h-[100px] mt-2"
                />
              </div>
              
              <div className="pt-2">
                <Label htmlFor="additionalFeedback" className="font-medium">Any other feedback or ideas?*</Label>
                <Textarea
                  id="additionalFeedback"
                  value={formData.feedback.additionalFeedback || ''}
                  onChange={(e) => handleTextChange('additionalFeedback', e.target.value)}
                  placeholder="Other thoughts..."
                  className="min-h-[100px] mt-2"
                />
              </div>
            </div>
            
            <Separator className="bg-purple-100" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-purple-800">
                Interested in a Custom Version of Northstar?
              </h3>
              
              <div className="text-sm text-muted-foreground">
                Would you like a tailored version of this tool for your firm or workflow?
              </div>
              
              <div>
                <Label htmlFor="customVersionInterest" className="font-medium">
                  What would you want to customize or build?
                </Label>
                <Textarea
                  id="customVersionInterest"
                  value={formData.feedback.customVersionInterest || ''}
                  onChange={(e) => handleTextChange('customVersionInterest', e.target.value)}
                  placeholder="Describe your customization interests..."
                  className="min-h-[100px] mt-2"
                />
              </div>
            </div>
            
            <Separator className="bg-purple-100" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-purple-800">User Context</h3>
              
              <div className="pt-2">
                <Label className="font-medium mb-2 block">What is your role in the architecture/design process?*</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {['Architect', 'Interior Designer', 'Practice Manager', 'Draftsperson', 'Builder', 'Client / Homeowner', 'Other'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`role-${role}`}
                        checked={formData.feedback.userRole?.includes(role) || false}
                        onCheckedChange={() => handleRoleSelection(role)}
                      />
                      <label
                        htmlFor={`role-${role}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
                
                {formData.feedback.userRole?.includes('Other') && (
                  <div className="mt-3">
                    <Label htmlFor="otherRole" className="text-sm">Please specify:</Label>
                    <Input
                      id="otherRole"
                      value={otherRole}
                      onChange={(e) => {
                        setOtherRole(e.target.value);
                        updateFormData('feedback', { otherRoleSpecify: e.target.value });
                      }}
                      className="mt-1"
                      placeholder="Your role"
                    />
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Label htmlFor="teamSize" className="font-medium">How many people are in your firm or team?*</Label>
                <Select
                  value={formData.feedback.teamSize || ''}
                  onValueChange={(value) => handleTextChange('teamSize', value)}
                >
                  <SelectTrigger className="mt-2" id="teamSize">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Just me">Just me</SelectItem>
                    <SelectItem value="2-5">2-5</SelectItem>
                    <SelectItem value="6-15">6-15</SelectItem>
                    <SelectItem value="15+">15+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator className="bg-purple-100" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-purple-800">Referral + Follow-Up Interest</h3>
              
              <div className="pt-2">
                <Label htmlFor="wouldRecommend" className="font-medium">Would you recommend this tool to others in your industry?*</Label>
                <RadioGroup
                  id="wouldRecommend"
                  value={formData.feedback.wouldRecommend || ''}
                  onValueChange={(value) => handleTextChange('wouldRecommend', value)}
                  className="flex flex-row space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="recommend-yes" />
                    <Label htmlFor="recommend-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="recommend-maybe" />
                    <Label htmlFor="recommend-maybe">Maybe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="recommend-no" />
                    <Label htmlFor="recommend-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="w-[100px]"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="w-[100px] bg-purple-500 hover:bg-purple-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
