import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const body = await request.json()
    const { slug } = await params
    
    console.log('API: Updating project with slug:', slug)
    console.log('API: Request body:', body)

    const { data, error } = await supabase
      .from('projects')
      .update({
        // Basic fields
        title: body.title,
        description: body.description,
        technologies: body.technologies?.filter((t: string) => t.trim()) || [],
        categories: body.categories?.filter((c: string) => c.trim()) || [],
        duration: body.duration,
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
        content_version: (body.content_version || 1) + 1,
        
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()

    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Update successful, data:', data[0])
    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 