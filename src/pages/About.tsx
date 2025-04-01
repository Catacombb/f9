import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ChevronLeft, Home } from 'lucide-react';
import { AppLogo } from '@/components/AppLogo';

const About = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Northstar
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <AppLogo size="large" />
              </div>
              <p className="text-xl text-muted-foreground">Guiding your design journey home</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-2">About Northstar</h2>
              <p>
                Northstar is a digital design brief tool that replaces traditional PDF forms
                for residential architecture projects. Whether you're planning a new build or
                renovation, Northstar guides you through a structured process to capture your
                vision, requirements, and preferences.
              </p>

              <h3 className="text-xl font-medium mt-6">How It Works</h3>
              <ol className="list-decimal pl-6 space-y-3 mt-2">
                <li>
                  <strong>Answer Questions:</strong> Move through sections covering project
                  information, budget, lifestyle needs, site details, and architectural preferences.
                </li>
                <li>
                  <strong>Upload Files:</strong> Share existing plans, sketches, or site photos to
                  provide context for your project.
                </li>
                <li>
                  <strong>Select Inspiration:</strong> Browse and select images that reflect your
                  aesthetic preferences and aspirations.
                </li>
                <li>
                  <strong>Review Summary:</strong> Get an AI-generated summary of your brief, which
                  you can edit and refine.
                </li>
                <li>
                  <strong>Export & Share:</strong> Download your complete brief as a PDF or share it
                  via email with your design team.
                </li>
              </ol>

              <h3 className="text-xl font-medium mt-6">Benefits</h3>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Save your progress any time and continue later</li>
                <li>Organize your thoughts and requirements in a structured format</li>
                <li>Communicate clearly with architects and designers</li>
                <li>Reduce misunderstandings and revisions during the design process</li>
                <li>Create a comprehensive record of your project vision</li>
              </ul>

              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-medium mb-3">Ready to start your design journey?</h3>
                <p className="mb-4">
                  Return to Northstar and begin creating your personalized design brief. The more
                  information you provide, the more valuable your brief will be.
                </p>
                <Link to="/">
                  <Button className="mt-2">
                    Return to Northstar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default About;
