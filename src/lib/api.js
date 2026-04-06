const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchFromApi(path, fallback, revalidate = 300) {
  if (!API_BASE_URL) {
    return fallback;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = await response.json();
    return payload?.data ?? fallback;
  } catch (error) {
    console.error(`API request failed for ${path}:`, error);
    return fallback;
  }
}

export async function getMenuItems() {
  return fetchFromApi("/menu", []);
}

export async function getCategories() {
  return fetchFromApi("/categories", []);
}

export async function getMenuItem(id) {
  return fetchFromApi(`/menu/${id}`, null);
}
