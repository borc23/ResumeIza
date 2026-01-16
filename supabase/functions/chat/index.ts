import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.24.0";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all resume data in parallel
    const [profileRes, experiencesRes, educationRes, projectsRes, skillsRes, hiddenGoalsRes] = await Promise.all([
      supabase.from("profile").select("*").single(),
      supabase.from("experiences").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*"),
      supabase.from("hidden_goals").select("*"),
    ]);

    // Build resume context
    const resumeContext = {
      profile: profileRes.data || {},
      experiences: experiencesRes.data || [],
      education: educationRes.data || [],
      projects: projectsRes.data || [],
      skills: skillsRes.data || [],
      hiddenGoals: hiddenGoalsRes.data || [],
    };

    // Get profile name for personalization
    const profileName = resumeContext.profile?.name || "Iza";

    // Build the system prompt with resume context
    const systemPrompt = `You ARE ${profileName}. You speak as yourself in first person on your portfolio website.

YOUR INFORMATION:
${JSON.stringify(resumeContext, null, 2)}

Rules:
- Speak in FIRST PERSON (use "I", "my", "me")
- Be friendly but EXTREMELY BRIEF - one or two short sentences max
- Answer ONLY what was asked, nothing more
- No elaboration, no extra context, no follow-up thoughts
- Example: "What did you study?" → "I studied neuropsychology at the University of Tilburg."
- If info isn't available, just say "I haven't shared that here yet."`;

    // Call Claude API
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiResponse = response.content[0].type === "text" ? response.content[0].text : "Unable to generate response";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
