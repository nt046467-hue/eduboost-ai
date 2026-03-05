
import React from 'react';

const TrustSafety: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold mb-8">Trust & Safety</h1>
      <div className="prose prose-invert max-w-none text-gray-400 space-y-6 leading-relaxed">
        <p>Education requires a safe, accurate, and reliable environment. EduBoost AI prioritizes these three pillars in everything we build.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Academic Integrity</h2>
        <p>We design our AI tools to be tutors, not "cheating machines." Our AI is programmed to explain concepts and methodology rather than simply providing answers without context. We encourage all students to use EduBoost AI as a supplement to their primary classroom learning.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Content Accuracy</h2>
        <p>All study guides on our platform undergo a rigorous peer-review process by subject matter experts. Our AI models are grounded in high-quality academic datasets to minimize "hallucinations" or factual errors.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Safe Learning Environment</h2>
        <p>Our platform is filtered to prevent the generation of harmful, biased, or inappropriate content. We maintain a zero-tolerance policy for any use of our tools that promotes hate speech or harassment.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">No Paywalls, Ever</h2>
        <p>Trust is built on accessibility. We guarantee that the core educational features of EduBoost AI will remain free and open to students globally, ensuring that financial status never dictates educational success.</p>
      </div>
    </div>
  );
};

export default TrustSafety;
