
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
      <div className="prose prose-invert max-w-none text-gray-400 space-y-6 leading-relaxed">
        <p>Last updated: October 2023</p>
        <p>By accessing EduBoost AI, you agree to the following terms and conditions. Our platform is designed to support global education through high-performance AI tools.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By using our website, study guides, and AI tools, you acknowledge that you have read and understood these terms. EduBoost AI provides these services free of charge for educational purposes only.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Use of AI Tools</h2>
        <p>The AI Assistant is provided for guidance and tutoring. You agree not to use the platform to generate spam, harmful content, or engage in academic dishonesty. We reserve the right to restrict access to users who violate these principles.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Intellectual Property</h2>
        <p>The content of our study guides, while free to read and use for personal study, remains the intellectual property of EduBoost AI and our contributing experts. Commercial redistribution of our content without express permission is prohibited.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Limitation of Liability</h2>
        <p>While we strive for 100% accuracy, EduBoost AI is provided "as is." We are not liable for any academic or professional outcomes resulting from the use of our platform.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Significant changes will be announced on our blog or via the home page updates.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
