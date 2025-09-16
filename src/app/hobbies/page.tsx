// pages/about.tsx
'use client';

import Image from "next/image";
import { Mail, Github, Linkedin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useRef, useState } from "react";
import { AdminAuthContext } from "@/components/home/AdminAuthProvider";

export default function About() {
  const { isAdmin } = useContext(AdminAuthContext);
  const [profilePic, setProfilePic] = useState("/profile.jpg");
  const [resumeUrl, setResumeUrl] = useState("/uploads/upload-1753184690173.pdf");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    setUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.url) {
        setUrl(result.url);
      }
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Profile Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <Image
            src={profilePic}
            alt="Hyeonjae Park"
            width={160}
            height={160}
            className="rounded-full object-cover border-4 border-primary shadow-md"
          />
          {isAdmin && (
            <>
              <button
                className="absolute bottom-2 right-2 bg-white text-xs border rounded-full px-2 py-1 shadow"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "..." : "Edit"}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFileUpload(e, setProfilePic)}
              />
            </>
          )}
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">Hyeonjae Park</h1>
          <p className="text-lg text-primary font-semibold">Software Developer & AI Engineer</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Passionate about scalable web apps, intelligent systems, and immersive games. I love solving real-world problems with code and creativity.
          </p>

          {isAdmin && (
            <div className="mt-4 flex flex-col gap-2 items-center md:items-start">
              <button
                className="text-sm bg-primary text-white px-3 py-1 rounded"
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload New Resume"}
              </button>
              <input
                type="file"
                accept="application/pdf"
                ref={resumeInputRef}
                className="hidden"
                onChange={(e) => handleFileUpload(e, setResumeUrl)}
              />
              <a
                href={resumeUrl}
                className="text-xs underline text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Current Resume
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-16 px-6">
        <h2 className="text-2xl font-semibold text-center mb-10">Core Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Curiosity", desc: "I believe in lifelong learning and exploring new technologies." },
            { title: "Integrity", desc: "I value honesty, transparency, and doing the right thing." },
            { title: "Collaboration", desc: "I thrive in teams and value diverse perspectives." },
          ].map((val, idx) => (
            <div key={idx} className="bg-card p-6 border rounded-lg shadow-sm text-center">
              <h3 className="text-primary font-semibold text-lg mb-2">{val.title}</h3>
              <p className="text-sm text-muted-foreground">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Contact & Resume</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:phjoon@umich.edu" className="flex items-center gap-2 hover:text-primary">
              <Mail className="w-5 h-5" />
              <span>hyeonjap@andrew.cmu.edu</span>
            </a>
            <a href="https://github.com/kpark1208" className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noreferrer">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/hyeonjae-park-71464635b/" className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noreferrer">
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
          <Button
            onClick={() => {
              const a = document.createElement("a");
              a.href = resumeUrl;
              a.download = resumeUrl.split("/").pop() || "Hyeonjoon_Park_Resume.pdf";
              a.click();
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Resume (PDF)
          </Button>
        </div>
      </section>
    </div>
  );
}
