// Supabase Edge Function for automatic cleanup
// Deploy this to Supabase Edge Functions for automated cleanup

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Verify this is a scheduled request or authorized call
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 })
    }

    try {
      const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Call the cleanup function
      const { data, error } = await supabase.rpc('cleanup_expired_files')

      if (error) {
        console.error('Cleanup error:', error)
        return new Response(
          JSON.stringify({ error: error.message }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          deletedCount: data?.deleted_count || 0,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (err) {
      console.error('Edge function error:', err)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

export default handler

// To deploy:
// 1. Install Supabase CLI: npm install -g supabase
// 2. Login: supabase login
// 3. Link project: supabase link --project-ref your-project-ref
// 4. Deploy: supabase functions deploy cleanup-expired-files
// 5. Set up cron: Create a cron job to call this function daily