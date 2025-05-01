
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { OccupantEntry } from '@/types';
import { Toaster } from '@/components/ui/toaster';
import { LifestylePeopleTab } from '../lifestyle/LifestylePeopleTab';
import { LifestyleGeneralTab } from '../lifestyle/LifestyleGeneralTab';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';

export function LifestyleSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const [activeTab, setActiveTab] = useState<string>("people");
  
  const handlePrevious = () => {
    setCurrentSection('budget');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    if (activeTab === "people") {
      setActiveTab("general");
    } else {
      setCurrentSection('site');
      window.scrollTo(0, 0);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle occupant entries change
  const handleOccupantEntriesChange = (entries: OccupantEntry[]) => {
    updateFormData('lifestyle', { occupantEntries: entries });
    
    // Also update the legacy occupants field as a JSON string with counts
    const counts = entries.reduce((acc, entry) => {
      const type = entry.type === 'child' ? 'children' : entry.type + 's';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, { adults: 0, children: 0, dogs: 0, cats: 0, other: 0 });
    
    updateFormData('lifestyle', { occupants: JSON.stringify(counts) });
  };
  
  const getButtonLabel = () => {
    return activeTab === "people" ? "Next: Daily Life" : "Next: Site";
  };
  
  // Extract only the lifestyle properties needed by LifestyleGeneralTab
  const lifestyleGeneralData = {
    dailyRoutine: formData.lifestyle.dailyRoutine || '',
    entertainmentStyle: formData.lifestyle.entertainmentStyle || '',
    workFromHome: formData.lifestyle.workFromHome || '',
    homeFeeling: formData.lifestyle.homeFeeling || '',
    specialRequirements: formData.lifestyle.specialRequirements || '',
    hobbies: formData.lifestyle.hobbies || [],
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Lifestyle" 
          description="Your lifestyle shapes how you'll use your home. This information helps us design spaces that support your daily activities and long-term needs."
          isBold={true}
        />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-6">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={cn(
                      "px-4 py-2 rounded-md transition-all hover:bg-accent text-base font-medium",
                      activeTab === "people" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                    onClick={() => setActiveTab("people")}
                  >
                    People & Pets
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={cn(
                      "px-4 py-2 rounded-md transition-all hover:bg-accent text-base font-medium",
                      activeTab === "general" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                    onClick={() => setActiveTab("general")}
                  >
                    Daily Life
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <TabsContent value="people" className="space-y-6 min-h-[400px]">
            <LifestylePeopleTab 
              occupantEntries={formData.lifestyle.occupantEntries || []} 
              onOccupantEntriesChange={handleOccupantEntriesChange}
            />
          </TabsContent>
          
          <TabsContent value="general" className="space-y-6 min-h-[400px]">
            <LifestyleGeneralTab 
              formData={lifestyleGeneralData}
              onFormChange={(name, value) => updateFormData('lifestyle', { [name]: value })}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            className="group transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Budget</span>
          </Button>
          
          <Button 
            onClick={handleNext} 
            className="group transition-all duration-200"
          >
            <span>{getButtonLabel()}</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
