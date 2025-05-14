import React from 'react';
import { cn } from '@/lib/utils';

type BriefStatus = 'draft' | 'brief_ready' | 'proposal_sent' | 'proposal_accepted';

interface ProgressTrackerProps {
  status: BriefStatus;
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  status,
  className
}) => {
  const steps = [
    { id: 'draft', label: 'Draft' },
    { id: 'brief_ready', label: 'Brief Ready' },
    { id: 'proposal_sent', label: 'Proposal Sent' },
    { id: 'proposal_accepted', label: 'Accepted' }
  ];
  
  // Determine current step index
  const currentStepIndex = steps.findIndex(step => step.id === status);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center mb-1">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div 
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border",
                index <= currentStepIndex 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-muted text-muted-foreground border-muted-foreground/30"
              )}
            >
              {index + 1}
            </div>
            
            {/* Connector line (except after last step) */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-1 flex-1 mx-1",
                  index < currentStepIndex 
                    ? "bg-primary" 
                    : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between text-xs mt-1">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={cn(
              "font-medium text-center flex-1",
              index === currentStepIndex 
                ? "text-primary font-semibold" 
                : index < currentStepIndex 
                  ? "text-primary/80" 
                  : "text-muted-foreground"
            )}
          >
            {step.label}
          </div>
        ))}
      </div>
      
      {/* Current status text */}
      <div className="mt-2 text-sm font-medium text-center">
        {status === 'draft' && "Complete and submit your brief to F9"}
        {status === 'brief_ready' && "Brief submitted, awaiting proposal"}
        {status === 'proposal_sent' && "Proposal ready for review"}
        {status === 'proposal_accepted' && "Proposal accepted!"}
      </div>
    </div>
  );
}; 