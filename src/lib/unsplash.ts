const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  urls: {
    regular: string;
    small: string;
  };
}

export async function getSubjectCoverImage(subject: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('No Unsplash API key configured');
    return null;
  }

  try {
    // Search for illustrations related to the subject
    const query = `${subject} illustration`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=portrait`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return null;
    }

    const data = await response.json();
    const photos: UnsplashPhoto[] = data.results;

    if (photos.length === 0) {
      // Fallback to generic aesthetic search
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=aesthetic+notebook&per_page=10&orientation=portrait`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackPhotos: UnsplashPhoto[] = fallbackData.results;
        if (fallbackPhotos.length > 0) {
          const randomIndex = Math.floor(Math.random() * fallbackPhotos.length);
          return fallbackPhotos[randomIndex].urls.small;
        }
      }
      return null;
    }

    // Pick a random photo from results
    const randomIndex = Math.floor(Math.random() * photos.length);
    return photos[randomIndex].urls.small;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return null;
  }
}
