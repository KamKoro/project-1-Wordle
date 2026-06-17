// === Partial Loader Utility === //
/**
 * Loads an HTML partial file and inserts it into the specified container
 * @param {string} partialPath - Path to the partial HTML file
 * @param {string} containerId - ID of the container element to insert the partial into
 * @returns {Promise<void>}
 */
async function loadPartial(partialPath, containerId) {
  try {
    const response = await fetch(partialPath);
    if (!response.ok) {
      throw new Error(`Failed to load partial: ${response.statusText}`);
    }
    const html = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    } else {
      console.error(`Container with id "${containerId}" not found`);
    }
  } catch (error) {
    console.error('Error loading partial:', error);
  }
}

/**
 * Loads the navbar partial into the page
 */
async function loadNavbar() {
  await loadPartial('partials/navbar.html', 'navbar-container');
}

