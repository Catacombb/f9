
import { DesignBrief } from '@/components/DesignBrief';
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import { ThemeProvider } from '@/components/ThemeProvider';

const Index = () => {
  return (
    <ThemeProvider>
      <DesignBriefProvider>
        <DesignBrief />
      </DesignBriefProvider>
    </ThemeProvider>
  );
};

export default Index;
