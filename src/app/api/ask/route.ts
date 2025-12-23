import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://crossborder-compliance-kb-backend.onrender.com/kb/answer';

// These are always included in every request
const REQUIRED_SOURCE_TYPES = ['tax_authority', 'regulator', 'statute'];
const REQUIRED_ASSET_CLASSES = ['tax', 'compliance'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Merge user's asset classes with required ones (remove duplicates)
    const userAssetClasses = body.asset_class_any || [];
    const mergedAssetClasses = [...new Set([...REQUIRED_ASSET_CLASSES, ...userAssetClasses])];

    // Build countries array - include citizenship, residency, and selected countries
    const userCountries = body.countries || [];
    const citizenship = body.persona?.citizenship;
    const residency = body.persona?.residency;
    
    // Merge all countries and remove duplicates
    const allCountries: string[] = [];
    if (citizenship) allCountries.push(citizenship);
    if (residency && residency !== citizenship) allCountries.push(residency);
    userCountries.forEach((country: string) => {
      if (!allCountries.includes(country)) {
        allCountries.push(country);
      }
    });

    // Fallback if no countries selected
    const finalCountries = allCountries.length > 0 ? allCountries : ['United States', 'India'];

    // Build the request payload matching the API format
    const payload = {
      kb_id: body.kb_id || 'global_invest_v1',
      persona: {
        citizenship: citizenship || 'India',
        residency: residency || 'India',
        investor_type: body.persona?.investor_type || 'individual',
      },
      intent: body.intent || 'cross_border_real_estate',
      question: body.question,
      countries: finalCountries,
      asset_class_any: mergedAssetClasses,
      source_type_any: REQUIRED_SOURCE_TYPES, // Always use these three
      trust_rank_lte: body.trust_rank_lte || 5,
      limit: body.limit || 10,
      output: 'json',
      strict_citations: true,
    };

    console.log('API Request Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        answer: {
          summary: 'Sorry, I encountered an error while fetching the information. Please try again.',
          sections: [],
          limitations: 'Unable to connect to the knowledge base.',
          citations: [],
        },
        evidence: [],
      },
      { status: 500 }
    );
  }
}