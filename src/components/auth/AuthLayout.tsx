import React from 'react';
import { AppLogo } from '@/components/AppLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <div className="container relative hidden h-24 flex-col items-center justify-center md:flex">
        <AppLogo size="large" />
      </div>
      <div className="container flex flex-col items-center justify-center space-y-6 py-8">
        <div className="md:hidden">
          <AppLogo />
        </div>
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 