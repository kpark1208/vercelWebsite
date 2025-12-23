import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Initialize Supabase client (will be validated in each route handler)
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Server configuration error: Supabase credentials not found' },
        { status: 500 }
      )
    }

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
        github_url: body.github_url || null,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check if Supabase is configured
    if (!supabase || !supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      return NextResponse.json(
        { error: 'Server configuration error: Supabase credentials not found' },
        { status: 500 }
      )
    }

    // Ensure params is resolved
    let slug: string
    try {
      const resolvedParams = await params
      slug = resolvedParams.slug
    } catch (paramError) {
      console.error('Error resolving params:', paramError)
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }
    
    console.log('API: Deleting project with slug:', slug)

    // Delete the project from Supabase
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('slug', slug)
      .select()

    if (error) {
      console.error('Supabase error deleting project:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete project' },
        { status: 500 }
      )
    }

    // Check if any rows were deleted
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    console.log('API: Delete successful for slug:', slug, 'Deleted:', data.length, 'row(s)')
    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    // Catch any unexpected errors and ensure we always return JSON
    console.error('Unexpected error in DELETE API route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log full error details for debugging
    if (errorStack) {
      console.error('Error stack:', errorStack)
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
} 