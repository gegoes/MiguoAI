export interface WikipediaSummary {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

export async function searchWikipedia(query: string): Promise<WikipediaSummary | null> {
  try {
    // 1. Search for the closest article
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&origin=*&srlimit=1`;
    
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error('Search request failed');
    
    const searchData = await searchRes.json();
    const searchResults = searchData.query?.search;
    
    if (!searchResults || searchResults.length === 0) {
      return null;
    }
    
    const bestMatchTitle = searchResults[0].title;
    
    // 2. Fetch the article summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      bestMatchTitle
    )}`;
    
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) throw new Error('Summary request failed');
    
    const summaryData = await summaryRes.json();
    
    return {
      title: summaryData.title,
      extract: summaryData.extract,
      thumbnail: summaryData.thumbnail,
      content_urls: summaryData.content_urls,
    };
  } catch (error) {
    console.error('Wikipedia API error:', error);
    throw error;
  }
}
