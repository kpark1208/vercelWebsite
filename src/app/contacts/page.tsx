// "use client";

// import { Mail, Github, Linkedin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// export default function ContactPage() {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);
//     setSubmitted(false);
//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setSubmitted(true);
//         setForm({ name: "", email: "", message: "" });
//       } else {
//         setError(data.error || "Failed to send message.");
//       }
//     } catch (err: any) {
//       setError("Failed to send message.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-muted py-16 px-6 flex flex-col items-center">
//       <h1 className="text-4xl font-bold text-center mb-6">Contact Me</h1>
//       <div className="bg-card border rounded-lg shadow-sm p-8 w-full max-w-xl flex flex-col gap-8">
//         {/* Contact Links */}
//         <div className="flex flex-wrap justify-center gap-6">
//           <a href="mailto:phjoon@umich.edu" className="flex items-center gap-2 hover:text-primary">
//             <Mail className="w-5 h-5" />
//             <span>phjoon@umich.edu</span>
//           </a>
//           <a href="https://github.com/phjoon1012" className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noreferrer">
//             <Github className="w-5 h-5" />
//             <span>GitHub</span>
//           </a>
//           <a href="https://linkedin.com/in/hyeonjoon-park-0000000000" className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noreferrer">
//             <Linkedin className="w-5 h-5" />
//             <span>LinkedIn</span>
//           </a>
//         </div>
//         {/* Contact Form */}
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={form.name}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={form.email}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
//             required
//           />
//           <textarea
//             name="message"
//             placeholder="Your Message"
//             value={form.message}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
//             required
//           />
//           <Button type="submit" disabled={submitting} className="w-full mt-2">
//             {submitting ? "Sending..." : "Send Message"}
//           </Button>
//           {submitted && (
//             <div className="text-green-600 text-center mt-2">Thank you! Your message has been sent.</div>
//           )}
//           {error && (
//             <div className="text-red-600 text-center mt-2">{error}</div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }
