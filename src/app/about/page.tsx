'use client';

import Image from "next/image";
import { Mail, Github, Linkedin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useRef, useState } from "react";
import { AdminAuthContext } from "@/components/home/AdminAuthProvider";

export default function About() {
  const { isAdmin } = useContext(AdminAuthContext);
  const [profilePic, setProfilePic] = useState("/profile.jpg");
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.url) {
        setProfilePic(result.url);
      }
    } catch (err) {
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.url) {
        setResumeUrl(result.url);
      }
    } catch (err) {
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadResume = () => {
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Hyeonjoon_Park_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 max-w-3xl mx-auto px-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary shadow-lg relative">
            <Image
              src={profilePic}
              alt="Hyeonjoon Park"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
            {isAdmin && (
              <button
                className="absolute bottom-2 right-2 bg-white/80 rounded-full px-2 py-1 text-xs border shadow"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Edit"}
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
          <h1 className="text-3xl font-bold mb-1">Hyeonjoon Park</h1>
          <p className="text-primary font-medium mb-2">Software Developer & AI Engineer</p>
          <p className="text-muted-foreground text-center max-w-xl">
            Passionate about building scalable web apps, intelligent AI systems, and immersive games. I love solving real-world problems with code and creativity.
          </p>
          {isAdmin && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                className="bg-primary text-white px-3 py-1 rounded text-xs"
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
              <input
                type="file"
                accept="application/pdf"
                ref={resumeInputRef}
                className="hidden"
                onChange={handleResumeChange}
              />
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 text-xs">View Current Resume</a>
              )}
            </div>
          )}
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">My Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2 text-primary">Curiosity</h3>
              <p className="text-muted-foreground text-sm">I believe in lifelong learning and exploring new technologies and ideas.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2 text-primary">Integrity</h3>
              <p className="text-muted-foreground text-sm">I value honesty, transparency, and doing the right thing—even when it's hard.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2 text-primary">Collaboration</h3>
              <p className="text-muted-foreground text-sm">I thrive in teams and believe the best solutions come from diverse perspectives.</p>
            </div>
          </div>
        </div>

        {/* Contact & Resume */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Get In Touch</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6">
              <a href="mailto:hyeonjap@andrew.cmu.edu" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <span>hyeonjap@andrew.cmu.edu</span>
              </a>
              <a href="https://github.com/kpark1208" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5 text-primary" />
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/hyeonjoon-park-0000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5 text-primary" />
                <span>LinkedIn</span>
              </a>
            </div>
            <Button onClick={handleDownloadResume} className="flex items-center gap-2 mt-4">
              <Download className="h-4 w-4" />
              Download Resume (PDF)
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 
 