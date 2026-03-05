
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none text-gray-400 space-y-6 leading-relaxed">
        <p>Last updated: October 2023</p>
        <p>At EduBoost AI, we are committed to protecting your privacy. This policy outlines how we handle data and our commitment to transparency.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Data Collection</h2>
        <p>Since EduBoost AI does not require user accounts, we do not collect personal identifying information (PII) such as your name, physical address, or phone number during normal browsing.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Usage Data</h2>
        <p>We collect anonymous usage statistics to improve our AI models and website performance. This includes browser type, page visit duration, and approximate geographic location (country level).</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. AI Interactions</h2>
        <p>Queries sent to our AI Assistant are processed to provide responses. We do not store these queries in association with any personal identity. We may use anonymized queries to further train and refine our educational models.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Third-Party Services</h2>
        <p>We may use educational partners and service providers (like Google GenAI) to power certain features. These partners are bound by strict confidentiality agreements.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contact Information</h2>
        <p>When you contact us via our secure form, your email and message are used solely to resolve your inquiry and are never sold or shared with third-party advertisers.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
