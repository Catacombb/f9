import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BriefTester: React.FC = () => {
  const { currentBriefId, saveProjectData, loadProjectData, isLoading, error } = useDesignBrief();
  const [briefIdToLoad, setBriefIdToLoad] = useState<string>('');
  const [saveResult, setSaveResult] = useState<string>('');
  const [loadResult, setLoadResult] = useState<string>('');

  const handleSave = async () => {
    try {
      const result = await saveProjectData();
      if (result.success) {
        setSaveResult(`Successfully saved brief with ID: ${result.projectId}`);
      } else {
        setSaveResult(`Failed to save brief: ${result.error}`);
      }
    } catch (error) {
      setSaveResult(`Error saving brief: ${error}`);
    }
  };

  const handleLoad = async () => {
    if (!briefIdToLoad.trim()) {
      setLoadResult('Please enter a brief ID');
      return;
    }

    try {
      const success = await loadProjectData(briefIdToLoad);
      if (success) {
        setLoadResult(`Successfully loaded brief: ${briefIdToLoad}`);
      } else {
        setLoadResult(`Failed to load brief: ${error || 'Unknown error'}`);
      }
    } catch (error) {
      setLoadResult(`Error loading brief: ${error}`);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Brief Persistence Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-semibold">Current Brief Status</h3>
            <p>Current Brief ID: {currentBriefId || 'None (New Brief)'}</p>
            {isLoading && <p className="text-yellow-600">Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-semibold">Save Brief</h3>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Current Brief'}
            </Button>
            {saveResult && <p className="mt-2">{saveResult}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-semibold">Load Brief</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Brief ID"
                value={briefIdToLoad}
                onChange={(e) => setBriefIdToLoad(e.target.value)}
              />
              <Button onClick={handleLoad} disabled={isLoading}>
                Load Brief
              </Button>
            </div>
            {loadResult && <p className="mt-2">{loadResult}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 