import { useEffect } from 'react';

export const useIframeHeight = (dependencies: any[] = []) => {
  useEffect(() => {
    // Only run if we're in an iframe
    if (window.self === window.top) return;

    const sendHeight = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      
      window.parent.postMessage(
        { 
          type: 'IFRAME_HEIGHT', 
          height,
          path: window.location.pathname 
        },
        '*'
      );
    };

    // Send immediately
    sendHeight();

    // Send on resize
    window.addEventListener('resize', sendHeight);

    // Send when content changes
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    // Send after images/fonts load
    window.addEventListener('load', sendHeight);

    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(sendHeight, 100);

    return () => {
      window.removeEventListener('resize', sendHeight);
      window.removeEventListener('load', sendHeight);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, dependencies);
};
