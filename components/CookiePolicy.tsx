
import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold mb-8">Cookie Policy</h1>
      <div className="prose prose-invert max-w-none text-gray-400 space-y-6 leading-relaxed">
        <p>Last updated: October 2023</p>
        <p>EduBoost AI uses cookies to provide a seamless and personalized learning experience. We believe in complete transparency regarding how your data is used.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. What are Cookies?</h2>
        <p>Cookies are small text files stored on your device that help websites remember your preferences and provide specific functionalities. They do not contain personal identification in our implementation.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Essential Cookies</h2>
        <p>We use essential cookies to maintain your bookmark state and theme preferences locally on your browser. Without these, features like "Save Guide" would reset every time you refresh the page.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Performance & Analytics</h2>
        <p>We use anonymous analytics cookies to see which study guides are the most popular. This helps our editorial team decide which topics to expand upon in future updates.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. AI Session Continuity</h2>
        <p>When you interact with the AI Tutor, temporary session data may be stored to maintain context across multiple questions within a single visit.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Managing Cookies</h2>
        <p>You can choose to disable cookies in your browser settings. Please note that certain features of EduBoost AI, such as persistent bookmarks, may not function as intended without cookies enabled.</p>
      </div>
    </div>
  );
};

export default CookiePolicy;
