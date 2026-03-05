import React, { useState } from "react";
import { useTheme } from "../hooks/ThemeContext";

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Send to Netlify Function which forwards to h32505513@gmail.com
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Form submission failed");
      }
    } catch (err) {
      console.error("Submission Failure:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section
      id="contact"
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}
    >
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full -z-10 ${isDark ? "bg-[#00e5ff]/5" : "bg-[#00e5ff]/3"}`}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#00e5ff]/20 bg-[#00e5ff]/5 text-[#00e5ff] text-[10px] font-black uppercase tracking-widest mb-8">
              Communication Portal
            </div>
            <h2
              className={`text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-none ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Get in{" "}
              <span
                className={isDark ? "text-white/40" : "text-gray-400"}
                style={{ fontStyle: "italic" }}
              >
                Touch
              </span>
            </h2>
            <p
              className={`text-xl mb-12 leading-relaxed max-w-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Whether you're a student seeking guidance or an institution
              looking to integrate our AI, our academic response team is ready.
            </p>

            <div className="space-y-10">
              {[
                {
                  title: "Priority Support",
                  info: "Global Response Nodes Active",
                  icon: "⚡",
                },
                {
                  title: "Academic Relations",
                  info: "Institutional Partnership Portal",
                  icon: "🌍",
                },
                {
                  title: "Press & Media",
                  info: "Inquiry Processing Enabled",
                  icon: "📰",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-6 group">
                  <div
                    className={`w-14 h-14 border rounded-2xl flex items-center justify-center text-2xl group-hover:border-[#00e5ff]/40 transition-all shadow-xl ${isDark ? "bg-[#0d0d0d] border-white/5" : "bg-gray-100 border-gray-300"}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}
                    >
                      {item.info}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute -inset-1 rounded-[40px] blur opacity-20 ${isDark ? "bg-gradient-to-r from-[#00e5ff] to-purple-600" : "bg-gradient-to-r from-cyan-400 to-purple-300"}`}
            ></div>
            <div
              className={`relative border rounded-[40px] p-8 md:p-12 shadow-2xl transition-colors ${isDark ? "bg-[#0d0d0d] border-white/5" : "bg-gray-50 border-gray-200"}`}
            >
              {status === "success" ? (
                <div className="py-20 text-center animate-fade-in">
                  <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-green-500/20">
                    ✓
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">
                    Transmission Received
                  </h3>
                  <p className="text-gray-400 mb-10 text-lg">
                    Your message has been securely routed through our encrypted
                    node. Expect a response shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-10 py-4 bg-[#1a1a1a] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/10 hover:border-[#00e5ff]/50 transition-all"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : status === "error" ? (
                <div className="py-20 text-center animate-fade-in">
                  <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-red-500/20">
                    ✕
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">
                    Transmission Failed
                  </h3>
                  <p className="text-gray-400 mb-10 text-lg">
                    Please check your connection and try again.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-10 py-4 bg-[#1a1a1a] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/10 hover:border-[#00e5ff]/50 transition-all"
                  >
                    Return to Form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      >
                        Identity Token
                      </label>
                      <input
                        required
                        type="text"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="Full Name"
                        className={`w-full px-8 py-5 border rounded-3xl focus:outline-none focus:border-[#00e5ff]/50 transition-all ${isDark ? "bg-[#050505] border-white/5 text-white placeholder:text-gray-800" : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"}`}
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      >
                        Communication Node
                      </label>
                      <input
                        required
                        type="email"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="email@example.com"
                        className={`w-full px-8 py-5 border rounded-3xl focus:outline-none focus:border-[#00e5ff]/50 transition-all ${isDark ? "bg-[#050505] border-white/5 text-white placeholder:text-gray-800" : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label
                      className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}
                    >
                      Encrypted Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="Input academic inquiry..."
                      className={`w-full px-8 py-5 border rounded-3xl focus:outline-none focus:border-[#00e5ff]/50 transition-all resize-none ${isDark ? "bg-[#050505] border-white/5 text-white placeholder:text-gray-800" : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"}`}
                    ></textarea>
                  </div>
                  <button
                    disabled={status === "sending"}
                    type="submit"
                    className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] text-[#0a0a0a] transition-all flex items-center justify-center gap-4 ${status === "sending" ? "bg-gray-800 cursor-not-allowed" : "bg-[#00e5ff] hover:scale-[1.02] shadow-2xl shadow-cyan/20 active:scale-95"}`}
                  >
                    {status === "sending"
                      ? "Processing..."
                      : "Dispatch Message"}
                  </button>
                  <p className="text-[9px] text-gray-700 text-center uppercase tracking-widest font-black flex items-center justify-center gap-2">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                    </svg>
                    End-to-End Encrypted Node Submission
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
