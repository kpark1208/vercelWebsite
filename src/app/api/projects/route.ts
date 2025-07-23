import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('API: Creating new project')
    console.log('API: Request body:', body)

    // Generate a slug from the title
    let slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists and make it unique
    let counter = 1
    const originalSlug = slug
    while (true) {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('slug')
        .eq('slug', slug)
        .single()
      
      if (!existingProject) {
        break // Slug is unique
      }
      
      slug = `${originalSlug}-${counter}`
      counter++
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        // Basic fields
        title: body.title,
        slug: slug,
        description: body.description || '',
        technologies: body.technologies?.filter((t: string) => t.trim()) || [],
        categories: body.categories?.filter((c: string) => c.trim()) || [],
        duration: body.duration || '',
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        project_location: body.project_location || null,
        achievements: body.achievements?.filter((a: string) => a.trim()) || [],
        
        // Modular content sections
        overview: body.overview || null,
        objective: body.objective || null,
        theory_approach: body.theory_approach || null,
        technical_deep_dive: body.technical_deep_dive || null,
        challenges_solutions: body.challenges_solutions || null,
        review: body.review || null,
        future_improvements: body.future_improvements || null,
        
        // Section management
        sections_order: body.sections_order || null,
        sections_visibility: body.sections_visibility || null,
        content_type: body.content_type || null,
        
        // Table of contents
        show_toc: body.show_toc !== undefined ? body.show_toc : true,
        toc_position: body.toc_position || 'left',
        
        // Code snippets
        code_snippets: body.code_snippets || null,
        
        // Content metadata
        last_edited: new Date().toISOString(),
        content_version: 1,
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')

    if (error) {
      console.error('Error creating project:', error)
      
      // Handle specific database errors
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: 'A project with this title already exists. Please choose a different title.' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Create successful, data:', data[0])
    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 