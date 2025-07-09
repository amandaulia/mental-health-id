import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feelings } = await req.json();

    if (!feelings || !openAIApiKey) {
      throw new Error('Missing required parameters');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a mental health resource recommendation system. Based on user's feelings and concerns, recommend appropriate mental health resources.

            Available resource types:
            - practitioner: Individual therapists/psychologists
            - institution: Mental health clinics/hospitals  
            - peer-counseling: Peer support groups
            - support-group: Community support groups
            - activity: Stress relief activities
            - organization: Mental health organizations
            - community: Mental health communities

            Respond with a JSON object containing:
            {
              "analysis": "Brief analysis of their feelings",
              "recommendations": [
                {
                  "type": "practitioner|institution|peer-counseling|support-group|activity|organization|community",
                  "id": "generated-id",
                  "name": "Resource name",
                  "city": "Jakarta|Bandung|Surabaya",
                  "reason": "Why this resource is recommended",
                  "isVerified": true|false,
                  // Additional fields based on type:
                  // For practitioner: "institutionName", "professionTypes", "specializations", "modes", "insurance"
                  // For institution: "professionTypes", "specializations", "modes", "insurance"  
                  // For peer-counseling/support-group: "specialization", "serviceType", "price"
                  // For activity: "organizationName", "activityType", "price"
                  // For organization/community: "organizationType"
                }
              ]
            }

            Provide 3-6 relevant recommendations. Make them realistic and helpful.`
          },
          { role: 'user', content: feelings }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to analyze feelings');
    }

    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-feelings function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: "We're having trouble analyzing your feelings right now.",
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});