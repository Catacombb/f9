
import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIHelperProps {
  text: string;
  fieldContent: string;
  type?: 'suggestion' | 'insight' | 'warning';
  onApply?: () => void;
}

export function AIHelper({ text, fieldContent, type = 'suggestion', onApply }: AIHelperProps) {
  const [visible, setVisible] = useState(false);
  
  // Only show if there's substantial user input to analyze
  useEffect(() => {
    if (fieldContent && fieldContent.length > 40) {
      // Delay showing to avoid distraction while typing
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [fieldContent]);
  
  if (!visible) return null;
  
  const bgColor = {
    suggestion: 'bg-blue-50 border-blue-200',
    insight: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200'
  }[type];
  
  const iconColor = {
    suggestion: 'text-blue-500',
    insight: 'text-green-500',
    warning: 'text-yellow-500'
  }[type];
  
  return (
    <Card className={`mt-2 p-3 text-sm animate-fade-in border ${bgColor}`}>
      <div className="flex items-start">
        <AlertCircle className={`h-4 w-4 mt-0.5 mr-2 shrink-0 ${iconColor}`} />
        <div className="flex-1 text-black">{text}</div>
        <div className="flex gap-2 ml-2 shrink-0">
          {onApply && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2 text-black"
              onClick={() => {
                onApply();
                setVisible(false);
              }}
            >
              <Check className="h-3 w-3 mr-1" /> Apply
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 px-2 text-black"
            onClick={() => setVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
