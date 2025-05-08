import React from 'react';
import { TestDashboardSchema } from '@/components/TestDashboardSchema';

export default function TestDashboardSchemePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Schema Test</h1>
      <p className="mb-8 text-gray-700">
        This page tests the database schema, RLS policies, and triggers implemented for the dashboard functionality.
        You must be logged in to run these tests.
      </p>
      <TestDashboardSchema />
    </div>
  );
} 