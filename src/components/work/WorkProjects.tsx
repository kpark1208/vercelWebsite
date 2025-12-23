"use client";

{/*PROJECT DISPLAY PAGE UNDER 'MY WORK' SECTION*/}

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Project, getAllProjects, searchProjects, getCategories, getTechnologies, parseProjectDescription, formatProjectDate } from "@/lib/projects";
import { AdminAuthContext } from "@/components/home/AdminAuthProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, X, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper to parse duration string to hours
function parseDurationToHours(duration: string): number {
  if (!duration) return 0;
  const lower = duration.toLowerCase();
  const num = parseFloat(lower);
  if (lower.includes('month')) return num * 160; // assume 160 hours/month
  if (lower.includes('week')) return num * 40; // assume 40 hours/week
  if (lower.includes('day')) return num * 8; // assume 8 hours/day
  if (lower.includes('hour')) return num;
  return 0;
}

// Helper to calculate duration in months
function calculateDurationInMonths(start: string, end: string): string {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  // If end day is after start day, count as an extra month
  if (endDate.getDate() >= startDate.getDate()) months += 1;
  if (months < 1) months = 1;
  return `${months} month${months > 1 ? 's' : ''}`;
}

const Blog17 = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);
  const [mainCategories, setMainCategories] = useState<string[]>(["All Articles"]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = React.useContext(AdminAuthContext);
  
  // Check if we're in dev mode (localhost)
  const isDevMode = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, categoriesData, technologiesData] = await Promise.all([
          getAllProjects(),
          getCategories(),
          getTechnologies()
        ]);
        
        setProjects(projectsData);
        setAllTechnologies(technologiesData);
        setMainCategories(["All Articles", ...categoriesData]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Search and filter projects
  useEffect(() => {
    const searchData = async () => {
      if (loading) return;
      
      try {
        const filteredProjects = await searchProjects(searchTerm, selectedCategory);
        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error searching projects:', error);
      }
    };

    searchData();
  }, [searchTerm, selectedCategory, loading]);

  // Get search suggestions based on current input
  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];
    
    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();
    
    // Add matching technologies
    allTechnologies.forEach(tech => {
      if (tech.toLowerCase().includes(searchLower)) {
        suggestions.add(tech);
      }
    });
    
    // Add matching categories
    mainCategories.forEach(category => {
      if (category.toLowerCase().includes(searchLower) && category !== "All Articles") {
        suggestions.add(category);
      }
    });
    
    // Add matching project titles
    projects.forEach(project => {
      if (project.title.toLowerCase().includes(searchLower)) {
        suggestions.add(project.title);
      }
    });
    
    return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, allTechnologies, mainCategories, projects]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
          setSearchTerm(searchSuggestions[selectedSuggestionIndex]);
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Articles");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle delete project
  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectToDelete.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to delete project (${response.status})`);
      }

      const result = await response.json();
      console.log('Delete successful:', result);

      // Remove project from local state
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete project. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="py-32">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto">
      <div className="container">
        {/* Search and Filter Section */}
        <div className="mx-auto mt-20 max-w-4xl space-y-8">
          {/* Search Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Find Your Perfect Project</h2>
            <p className="text-muted-foreground text-lg">Search through my experiences by technology, category, or project name</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              ref={searchInputRef}
              placeholder="Search projects, technologies, languages..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(searchTerm.length > 0)}
              className="pl-12 h-12 text-lg"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 mt-1"
              >
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors",
                      selectedSuggestionIndex === index && "bg-muted"
                    )}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Technologies Quick Search */}
          {!searchTerm && (
            <div className="text-center space-y-4">
              <p className="text-lg font-medium text-muted-foreground">Popular technologies:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["React", "Python", "Unity", "Node.js", "Docker", "TypeScript"].map((tech) => (
                  <Button
                    key={tech}
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setSearchTerm(tech);
                      setShowSuggestions(false);
                    }}
                    className="text-base px-6 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
          )}

         
          {/* Results Count */}
          <div className="text-center text-muted-foreground">
            Showing {projects.length} projects
            {searchTerm && (
              <span className="ml-2">
                • Searching for "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-20 lg:grid-cols-4">
          <div className="hidden flex-col gap-2 lg:flex">
            {mainCategories.map((category) => (
              <Button
                variant="ghost"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "justify-start text-left",
                  selectedCategory === category &&
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                {category}
              </Button>
            ))}
            
            {/* Admin-only New Project button */}
            {isAdmin && (
              <>
                <div className="my-4 border-t border-border"></div>
                <Link href="/work/new">
                  <Button 
                    variant="outline" 
                    className="justify-start text-left w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="lg:col-span-3">
            {projects.length > 0 ? (
              projects.map((item) => (
                <React.Fragment key={item.id}>
                  <div className="group relative hover:bg-muted/30 p-6 rounded-none transition-colors border-t border-b border-border">
                    {/* Dev Mode Delete Button */}
                    {isDevMode && isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteClick(item, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Link href={`/projects/${item.slug}`} className="block">
                      {/* Categories Row - now above the title */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.categories.map((category, index) => (
                          <span
                            key={index}
                            className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          {/* Remove categories from here */}
                        </div>
                      {/*display start and end date if available, otherwise display duration*/}
                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground flex-shrink-0 ml-4">
                        {/* Start / End Date */}
                        {(item.start_date || item.end_date) && (
                          <span>
                            {item.start_date ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                            {item.start_date && item.end_date ? ' ~ ' : ''}
                            {item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                          </span>
                        )}
                        {/* Location */}
                        {item.project_location && (
                          <span>{item.project_location}</span>
                        )}
                        {/* Duration */}
                        <span className="text-primary font-medium">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {(() => {
                        const sections = parseProjectDescription(item.description || '');
                        return sections.overview || item.description || '';
                      })()}
                    </p>
                    
                    {/* Technologies - stays below description */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {/* Key Achievements - More Prominent */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">Key Achievements</h4>
                      <ul className="space-y-1">
                        {item.achievements.slice(0, 3).map((achievement, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1 text-sm">•</span>
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                        {item.achievements.length > 3 && (
                          <li className="text-sm text-muted-foreground italic">
                            +{item.achievements.length - 3} more achievements
                          </li>
                        )}
                      </ul>
                    </div>
                    </Link>
                  </div>
                  <div className="h-6" />
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No projects found matching your criteria.
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{projectToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Blog17;
