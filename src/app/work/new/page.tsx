"use client";

{/*CREATE NEW PROJECT PAGE UNDER 'MY WORK' SECTION*/}

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminAuthContext } from "@/components/home/AdminAuthProvider";

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[];
  categories: string[];
  duration: string;
  start_date: string;
  end_date: string;
  project_location: string;
  achievements: string[];
}

function calculateDurationInMonths(start: string, end: string): string {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (endDate.getDate() >= startDate.getDate()) months += 1;
  if (months < 1) months = 1;
  return `${months} month${months > 1 ? 's' : ''}`;
}

export default function NewProject() {
  const { isAdmin } = useContext(AdminAuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    technologies: [''],
    categories: [''],
    duration: '',
    start_date: '',
    end_date: '',
    project_location: '',
    achievements: ['']
  });

  if (!isAdmin) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
          <p className="text-muted-foreground">You must be an admin to create a new project.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'technologies' | 'categories' | 'achievements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'technologies' | 'categories' | 'achievements') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'technologies' | 'categories' | 'achievements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: calculateDurationInMonths(formData.start_date, formData.end_date),
          technologies: formData.technologies.filter(t => t.trim()),
          categories: formData.categories.filter(c => c.trim()),
          achievements: formData.achievements.filter(a => a.trim())
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create project');
      }

      router.push(`/projects/${result.data.slug}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/work" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Work
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Add a new project to your portfolio. Fill in the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={calculateDurationInMonths(formData.start_date, formData.end_date)}
                    readOnly
                    placeholder="Duration will be calculated"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_location">Location</Label>
                <Input
                  id="project_location"
                  value={formData.project_location}
                  onChange={(e) => handleInputChange('project_location', e.target.value)}
                  placeholder="e.g., Remote, NYC"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Technologies</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('technologies')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technology
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tech}
                      onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                      placeholder="e.g., React, TypeScript"
                    />
                    {formData.technologies.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('technologies', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Categories</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('categories')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.categories.map((category, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={category}
                      onChange={(e) => handleArrayChange('categories', index, e.target.value)}
                      placeholder="e.g., Web Development, Machine Learning"
                    />
                    {formData.categories.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('categories', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Key Achievements</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('achievements')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={achievement}
                      onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                      placeholder="Describe a key achievement or outcome"
                      rows={2}
                    />
                    {formData.achievements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('achievements', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/work">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading || !formData.title.trim()}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 