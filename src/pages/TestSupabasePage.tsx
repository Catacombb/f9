import React from 'react';
import { TestSupabase } from '@/components/TestSupabase';

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Supabase Connection Test Page</h1>
      <TestSupabase />
    </div>
  );
} 