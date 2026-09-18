import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "TaskFlow AI - Intelligent task and time tracking for modern professionals.", 
  type = "website" 
}) => {
  return (
    <Helmet>
      <title>{title} | TaskFlow AI</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={`${title} | TaskFlow AI`} />
      <meta property="og:description" content={description} />
      <meta name="twitter:creator" content="@TaskFlowAI" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | TaskFlow AI`} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
