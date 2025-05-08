import '@testing-library/jest-dom';

// Mock the environment variables that would be available with Vite
window.process = window.process || {};
window.process.env = window.process.env || {};
window.process.env.VITE_SUPABASE_URL = 'https://example-test-url.supabase.co';
window.process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key-for-testing-only';

// Mock import.meta.env
// @ts-ignore
globalThis.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'https://example-test-url.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key-for-testing-only',
      MODE: 'test',
    }
  }
}; 