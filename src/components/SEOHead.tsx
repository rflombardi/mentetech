import { useEffect } from "react";
import { BlogMetadata } from "@/types/blog";

interface SEOHeadProps {
  metadata: BlogMetadata;
  structuredData?: Record<string, any>;
}

const SEOHead = ({ metadata, structuredData }: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = metadata.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metadata.description);
    }
    
    // Update meta keywords if provided
    if (metadata.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', metadata.keywords);
      }
    }
    
    // Update canonical URL if provided
    if (metadata.canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', metadata.canonical);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', metadata.title);
    if (ogDescription) ogDescription.setAttribute('content', metadata.description);
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle) twitterTitle.setAttribute('content', metadata.title);
    if (twitterDescription) twitterDescription.setAttribute('content', metadata.description);
    
    // Add structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('#structured-data');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.id = 'structured-data';
        (structuredDataScript as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }
  }, [metadata, structuredData]);

  return null; // This component doesn't render anything
};

export default SEOHead;