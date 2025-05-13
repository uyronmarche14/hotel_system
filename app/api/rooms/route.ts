import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/constants';

/**
 * Proxy handler for fetching rooms from the backend API
 */
export async function GET(request: NextRequest) {
  try {
    // Construct the URL to the backend API
    const url = `${API_URL}/api/hotels/rooms`;
    console.log(`Proxying GET request to: ${url}`);
    
    // Forward the request to the backend API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    // Log response for debugging
    console.log(`Received response from ${url} with status: ${response.status}`);
    
    // If the response is not OK, handle it safely
    if (!response.ok) {
      console.error(`API responded with status ${response.status}: ${response.statusText}`);
      
      // Get content type to check if it's JSON or HTML
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        // If JSON, just pass through the error response
        try {
          const errorData = await response.json();
          return NextResponse.json(errorData, { status: response.status });
        } catch (parseError) {
          return NextResponse.json(
            { error: response.statusText || 'Unknown error' },
            { status: response.status }
          );
        }
      } else {
        // If not JSON (likely HTML), return a proper JSON error
        const text = await response.text();
        console.error('Error response content:', text.substring(0, 500));
        
        return NextResponse.json(
          { 
            error: 'API request failed', 
            status: response.status,
            message: response.statusText || 'The server returned an invalid response'
          },
          { status: response.status }
        );
      }
    }
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in API proxy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 