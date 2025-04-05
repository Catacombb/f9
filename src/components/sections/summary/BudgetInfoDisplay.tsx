
import React from 'react';
import { ProjectData } from '@/types';

interface BudgetInfoDisplayProps {
  budget: ProjectData['formData']['budget'];
}

export function BudgetInfoDisplay({ budget }: BudgetInfoDisplayProps) {
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Budget Information</h4>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Budget Range:</p>
          <p className="text-sm">{budget.budgetRange || "Not provided"}</p>
        </div>
        {budget.flexibilityNotes && (
          <div>
            <p className="text-sm font-medium">Budget Flexibility Notes:</p>
            <p className="text-sm">{budget.flexibilityNotes}</p>
          </div>
        )}
        {budget.priorityAreas && (
          <div>
            <p className="text-sm font-medium">Priority Areas:</p>
            <p className="text-sm">{budget.priorityAreas}</p>
          </div>
        )}
        {budget.timeframe && (
          <div>
            <p className="text-sm font-medium">Timeframe:</p>
            <p className="text-sm">{budget.timeframe}</p>
          </div>
        )}
      </div>
    </div>
  );
}
