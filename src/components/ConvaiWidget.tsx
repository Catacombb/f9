import { useEffect } from "react";

export const ConvaiWidget = () => {
  useEffect(() => {
    // Create the widget element
    const widgetElement = document.createElement("elevenlabs-convai");
    widgetElement.setAttribute("agent-id", "aVhzNaXJkbNYfOwsNIKe");
    
    // Create the script element
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://elevenlabs.io/convai-widget/index.js";
    scriptElement.async = true;
    scriptElement.type = "text/javascript";
    
    // Add custom CSS to ensure proper positioning
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      elevenlabs-convai {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
      }
      
      /* Ensure the widget popup appears above other elements */
      div[id^="convai-"] {
        z-index: 9999 !important;
      }
    `;
    
    // Append to body
    document.head.appendChild(styleElement);
    document.body.appendChild(widgetElement);
    document.body.appendChild(scriptElement);
    
    // Clean up on unmount
    return () => {
      document.body.removeChild(widgetElement);
      document.head.removeChild(styleElement);
      if (document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  // This component doesn't render anything itself
  return null;
};

export default ConvaiWidget; 