import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Zap, Brain, Star, BookOpen, TrendingUp, AlertTriangle, Edit, MapPin, FileCode } from "lucide-react";
import { getProjectBySlug, parseProjectDescription, Project, formatProjectDate } from "@/lib/projects";
import TSPVisualizer from "@/components/work/TSPVisualizer";
import MarkdownRenderer from "@/components/work/MarkdownRenderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectEditButton from "@/components/work/ProjectEditButton";
import TableOfContents from "@/components/work/TableOfContents";
import ProjectSection from "@/components/work/ProjectSection";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  SECTION_CONFIGS, 
  DEFAULT_SECTIONS_ORDER, 
  DEFAULT_SECTIONS_VISIBILITY,
  DEFAULT_CONTENT_TYPE 
} from "@/lib/section-config";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    };
  }

  const description = project.description || project.overview || 'Project details';
  
  return {
    title: `${project.title} - Portfolio Project`,
    description: description.substring(0, 160),
    keywords: [...project.technologies, ...project.categories].join(', '),
    openGraph: {
      title: project.title,
      description: description.substring(0, 160),
      type: 'article',
      publishedTime: project.created_at,
      modifiedTime: project.updated_at,
    },
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  // This will pre-generate pages for known projects
  // You can expand this to fetch all project slugs
  return [
    { slug: 'traveling-salesman-problem-solver' },
    { slug: 'euchre-card-game' },
    // Add more known slugs here
  ];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Server-side data fetching
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  // Parse the enhanced description into sections (for backward compatibility)
  const descriptionSections = parseProjectDescription(project.description || '');

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button and Edit Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/work">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Work
            </Button>
          </Link>
          <ProjectEditButton slug={slug} />
        </div>

        {/* Project Header - Resume Style */}
        <div className="mb-8">
          {/* Title and Category Row */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-foreground">
              {project.title}
            </h1>
            <div className="flex items-center gap-2">
              {project.categories.map((category: string, index: number) => (
                <span key={index} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {/* Project Overview */}
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            {project.overview || descriptionSections.overview || project.description}
          </p>

          {/* Compact Project Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {(project.start_date || project.end_date)
                  ? formatProjectDate(project.start_date, project.end_date, project.project_location)
                  : project.duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Solo Project</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Production Ready</span>
            </div> */}
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Featured</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {renderAllContentInOrder(project)}

          {/* Code Snippets */}
          {project.code_snippets && project.code_snippets.length > 0 && (
            <ProjectSection
              id="code-snippets"
              title="Code Snippets"
              icon={<FileCode className="h-6 w-6" />}
            >
              <div className="space-y-6">
                {project.code_snippets.map((snippet) => (
                  <div key={snippet.id} className="space-y-2">
                    {snippet.title && (
                      <h4 className="text-lg font-semibold">{snippet.title}</h4>
                    )}
                    {snippet.description && (
                      <p className="text-muted-foreground">{snippet.description}</p>
                    )}
                    <div className="relative">
                      <SyntaxHighlighter
                        language={snippet.language}
                        style={oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        {snippet.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ))}
              </div>
            </ProjectSection>
          )}

          {/* TSP Visualizer - Keep as client component */}
          {project.slug === 'traveling-salesman-problem-solver' && (
            <ProjectSection
              id="tsp-visualizer"
              title="TSP Algorithm Visualizer"
              icon={<MapPin className="h-6 w-6" />}
            >
              <TSPVisualizer />
            </ProjectSection>
          )}

          {/* Project Links */}
          <ProjectSection
            id="project-links"
            title="Project Links"
            icon={<ExternalLink className="h-6 w-6" />}
          >
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
              {/* Add more project links as needed */}
            </div>
          </ProjectSection>
        </div>
      </div>
    </div>
  );
}

// Helper function to get sections for table of contents
function getSectionsForTOC(project: Project) {
  const sections: Array<{ id: string; title: string; visible: boolean }> = [];
  
  // 1. Objective
  const objectiveContent = project.objective as string;
  if (objectiveContent?.trim()) {
    sections.push({
      id: 'objective',
      title: 'Objective',
      visible: true
    });
  }
  
  // 2. Achievements (database field)
  if (project.achievements && project.achievements.length > 0) {
    sections.push({
      id: 'achievements',
      title: 'Key Achievements',
      visible: true
    });
  }
  
  // 3. Technologies (database field)
  if (project.technologies && project.technologies.length > 0) {
    sections.push({
      id: 'technologies',
      title: 'Technologies Used',
      visible: true
    });
  }
  
  // 4. Theory & Approach
  const theoryContent = project.theory_approach as string;
  if (theoryContent?.trim()) {
    sections.push({
      id: 'theory_approach',
      title: 'Theory & Approach',
      visible: true
    });
  }
  
  // 5. Technical Deep Dive
  const technicalContent = project.technical_deep_dive as string;
  if (technicalContent?.trim()) {
    sections.push({
      id: 'technical_deep_dive',
      title: 'Technical Deep Dive',
      visible: true
    });
  }
  
  // 6. Challenges & Solutions
  const challengesContent = project.challenges_solutions as string;
  if (challengesContent?.trim()) {
    sections.push({
      id: 'challenges_solutions',
      title: 'Challenges & Solutions',
      visible: true
    });
  }
  
  // 7. Review
  const reviewContent = project.review as string;
  if (reviewContent?.trim()) {
    sections.push({
      id: 'review',
      title: 'Review',
      visible: true
    });
  }
  
  // 8. Future Improvements
  const futureContent = project.future_improvements as string;
  if (futureContent?.trim()) {
    sections.push({
      id: 'future_improvements',
      title: 'Future Improvements',
      visible: true
    });
  }
  
  return sections;
}

// Helper function to render all content in the correct order
function renderAllContentInOrder(project: Project) {
  const sections: React.ReactElement[] = [];
  const contentType = project.content_type || DEFAULT_CONTENT_TYPE;
  
  // 1. Objective
  const objectiveContent = project.objective as string;
  if (objectiveContent?.trim()) {
    const config = SECTION_CONFIGS['objective'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="objective"
          id="objective"
          title={config.title}
          content={objectiveContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['objective'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 2. Achievements (database field)
  if (project.achievements && project.achievements.length > 0) {
    sections.push(
      <ProjectSection
        key="achievements"
        id="achievements"
        title="Key Achievements"
        icon={<Star className="h-6 w-6" />}
      >
        <ul className="space-y-2">
          {project.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{achievement}</span>
            </li>
          ))}
        </ul>
      </ProjectSection>
    );
  }
  
  // 3. Technologies (database field)
  if (project.technologies && project.technologies.length > 0) {
    sections.push(
      <ProjectSection
        key="technologies"
        id="technologies"
        title="Technologies Used"
        icon={<Zap className="h-6 w-6" />}
      >
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span key={index} className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </ProjectSection>
    );
  }
  
  // 4. Theory & Approach
  const theoryContent = project.theory_approach as string;
  if (theoryContent?.trim()) {
    const config = SECTION_CONFIGS['theory_approach'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="theory_approach"
          id="theory_approach"
          title={config.title}
          content={theoryContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['theory_approach'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 5. Technical Deep Dive
  const technicalContent = project.technical_deep_dive as string;
  if (technicalContent?.trim()) {
    const config = SECTION_CONFIGS['technical_deep_dive'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="technical_deep_dive"
          id="technical_deep_dive"
          title={config.title}
          content={technicalContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['technical_deep_dive'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 6. Challenges & Solutions
  const challengesContent = project.challenges_solutions as string;
  if (challengesContent?.trim()) {
    const config = SECTION_CONFIGS['challenges_solutions'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="challenges_solutions"
          id="challenges_solutions"
          title={config.title}
          content={challengesContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['challenges_solutions'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 7. Review
  const reviewContent = project.review as string;
  if (reviewContent?.trim()) {
    const config = SECTION_CONFIGS['review'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="review"
          id="review"
          title={config.title}
          content={reviewContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['review'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 8. Future Improvements
  const futureContent = project.future_improvements as string;
  if (futureContent?.trim()) {
    const config = SECTION_CONFIGS['future_improvements'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="future_improvements"
          id="future_improvements"
          title={config.title}
          content={futureContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['future_improvements'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  return sections;
}

// Helper function to render modular sections
function renderModularSections(project: Project) {
  const sectionsOrder = project.sections_order || DEFAULT_SECTIONS_ORDER;
  const sectionsVisibility = project.sections_visibility || DEFAULT_SECTIONS_VISIBILITY;
  const contentType = project.content_type || DEFAULT_CONTENT_TYPE;
  
  // If no modular content exists, fall back to the old description format
  const hasModularContent = sectionsOrder.some(sectionId => {
    const content = project[sectionId as keyof Project] as string;
    return content?.trim();
  });
  
  if (!hasModularContent && project.description) {
    // Fall back to old description format
    const descriptionSections = parseProjectDescription(project.description);
    
    return Object.entries(descriptionSections).map(([sectionKey, content]) => {
      if (!content?.trim()) return null;
      
      // Map old section keys to new ones
      const sectionMapping: Record<string, string> = {
        'overview': 'overview',
        'theory_and_approach': 'theory_approach',
        'technical_deep_dive': 'technical_deep_dive',
        'challenges_and_solutions': 'challenges_solutions',
        'lessons_learned': 'review'
      };
      
      const newSectionId = sectionMapping[sectionKey];
      if (!newSectionId) return null;
      
      const config = SECTION_CONFIGS[newSectionId];
      if (!config) return null;
      
      const IconComponent = config.icon;
      
      return (
        <ProjectSection
          key={newSectionId}
          id={newSectionId}
          title={config.title}
          content={content}
          contentType="markdown"
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }).filter(Boolean);
  }
  
  // Use modular content with custom order
  const sections: React.ReactElement[] = [];
  
  // 1. Objective
  const objectiveContent = project.objective as string;
  if (objectiveContent?.trim()) {
    const config = SECTION_CONFIGS['objective'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="objective"
          id="objective"
          title={config.title}
          content={objectiveContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['objective'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 2. Achievements (database field) - will be rendered separately after modular sections
  // 3. Technologies (database field) - will be rendered separately after modular sections
  
  // 4. Theory & Approach
  const theoryContent = project.theory_approach as string;
  if (theoryContent?.trim()) {
    const config = SECTION_CONFIGS['theory_approach'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="theory_approach"
          id="theory_approach"
          title={config.title}
          content={theoryContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['theory_approach'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 5. Technical Deep Dive
  const technicalContent = project.technical_deep_dive as string;
  if (technicalContent?.trim()) {
    const config = SECTION_CONFIGS['technical_deep_dive'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="technical_deep_dive"
          id="technical_deep_dive"
          title={config.title}
          content={technicalContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['technical_deep_dive'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 6. Challenges & Solutions
  const challengesContent = project.challenges_solutions as string;
  if (challengesContent?.trim()) {
    const config = SECTION_CONFIGS['challenges_solutions'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="challenges_solutions"
          id="challenges_solutions"
          title={config.title}
          content={challengesContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['challenges_solutions'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 7. Review
  const reviewContent = project.review as string;
  if (reviewContent?.trim()) {
    const config = SECTION_CONFIGS['review'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="review"
          id="review"
          title={config.title}
          content={reviewContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['review'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  // 8. Future Improvements
  const futureContent = project.future_improvements as string;
  if (futureContent?.trim()) {
    const config = SECTION_CONFIGS['future_improvements'];
    if (config) {
      const IconComponent = config.icon;
      sections.push(
        <ProjectSection
          key="future_improvements"
          id="future_improvements"
          title={config.title}
          content={futureContent}
          contentType={(contentType as Record<string, 'markdown' | 'text'>)['future_improvements'] || config.defaultContentType}
          icon={<IconComponent className="h-6 w-6" />}
        />
      );
    }
  }
  
  return sections;
} 