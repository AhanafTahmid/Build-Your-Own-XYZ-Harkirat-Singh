const CLARIFAI_PAT = process.env.EXPO_PUBLIC_CLARIFAI_KEY;

if (!CLARIFAI_PAT) {
  console.error('⚠️ CLARIFAI_PAT is not set in .env file!');
}

const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'general-image-recognition';
const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';

interface ClarifaiImageResult {
  url: string;
  score: number;
  concepts?: string[];
}

interface SearchResponse {
  results: ClarifaiImageResult[];
  nextPage?: string;
}

export class ClarifaiService {
  private static baseUrl = 'https://api.clarifai.com/v2';
  
  private static async makeRequest(endpoint: string, body: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLARIFAI_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.status?.details || 'Clarifai API error');
    }

    return response.json();
  }

  static async searchByText(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await this.makeRequest('/searches', {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        query: {
          ands: [{
            output: {
              data: {
                concepts: [{
                  name: query,
                  value: 1
                }]
              }
            }
          }]
        },
        pagination: {
          page: page,
          per_page: 20
        }
      });

      const results = response.hits?.map((hit: any) => ({
        url: hit.input?.data?.image?.url,
        score: hit.score,
        concepts: hit.input?.data?.concepts?.map((c: any) => c.name) || []
      })) || [];

      return {
        results: results.filter((r: ClarifaiImageResult) => r.url),
        nextPage: response.hits?.length === 20 ? String(page + 1) : undefined
      };
    } catch (error) {
      console.error('Clarifai search error:', error);
      throw error;
    }
  }

  static async searchByImage(imageUrl: string): Promise<SearchResponse> {
    try {
      const response = await this.makeRequest('/searches', {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        query: {
          ands: [{
            output: {
              input: {
                data: {
                  image: {
                    url: imageUrl
                  }
                }
              }
            }
          }]
        },
        pagination: {
          per_page: 20
        }
      });

      const results = response.hits?.map((hit: any) => ({
        url: hit.input?.data?.image?.url,
        score: hit.score,
      })) || [];

      return {
        results: results.filter((r: ClarifaiImageResult) => r.url)
      };
    } catch (error) {
      console.error('Clarifai visual search error:', error);
      throw error;
    }
  }

  static async analyzeImage(imageUrl: string): Promise<string[]> {
    try {
      const response = await this.makeRequest(`/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        inputs: [{
          data: {
            image: {
              url: imageUrl
            }
          }
        }]
      });

      const concepts = response.outputs?.[0]?.data?.concepts || [];
      return concepts
        .filter((c: any) => c.value > 0.9)
        .map((c: any) => c.name)
        .slice(0, 5);
    } catch (error) {
      console.error('Clarifai analyze error:', error);
      return [];
    }
  }
}