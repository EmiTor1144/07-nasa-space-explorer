// Find our date picker inputs, filter checkboxes, and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const showImagesCheckbox = document.getElementById('showImages');
const showVideosCheckbox = document.getElementById('showVideos');
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');

// NASA Images API configuration
const NASA_IMAGES_URL = 'https://images-api.nasa.gov/search';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Add event listener to the "Get Space Images" button
getImagesButton.addEventListener('click', getSpaceImages);

// Function to fetch and display space images and videos from NASA Images API
async function getSpaceImages() {
  // Get the selected date range
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Check which media types are selected
  const includeImages = showImagesCheckbox.checked;
  const includeVideos = showVideosCheckbox.checked;
  
  // Make sure at least one media type is selected
  if (!includeImages && !includeVideos) {
    alert('Please select at least one media type (Images or Videos)');
    return;
  }
  
  // Show loading message based on selected filters
  const mediaTypes = [];
  if (includeImages) mediaTypes.push('images');
  if (includeVideos) mediaTypes.push('videos');
  
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space ${mediaTypes.join(' and ')} from ${startDate} to ${endDate}...</p>
    </div>
  `;
  
  try {
    // Extract years from the selected dates
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    
    // Prepare API calls based on selected filters
    const apiCalls = [];
    
    // Add image API call if images are selected
    if (includeImages) {
      const imageApiUrl = `${NASA_IMAGES_URL}?q=space&media_type=image&year_start=${startYear}&year_end=${endYear}`;
      apiCalls.push(fetch(imageApiUrl));
    }
    
    // Add video API call if videos are selected
    if (includeVideos) {
      const videoApiUrl = `${NASA_IMAGES_URL}?q=videos&media_type=video&year_start=${startYear}&year_end=${endYear}`;
      apiCalls.push(fetch(videoApiUrl));
    }
    
    // Fetch data from selected NASA Images API endpoints
    const responses = await Promise.all(apiCalls);
    const dataResults = await Promise.all(responses.map(response => response.json()));
    
    // Combine selected media types into one array
    const allItems = [];
    
    // Add results from each API call
    dataResults.forEach(data => {
      if (data.collection && data.collection.items) {
        allItems.push(...data.collection.items);
      }
    });
    
    // Check if we got any results
    if (allItems.length === 0) {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">😔</div>
          <p>No ${mediaTypes.join(' or ')} found from ${startYear} to ${endYear}. Try different dates!</p>
        </div>
      `;
      return;
    }
    
    // Display the filtered media in the gallery
    displayImages(allItems);
    
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error('Error fetching images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>Sorry, there was an error loading the images. Please try again.</p>
      </div>
    `;
  }
}

// Function to display images and videos in the gallery
function displayImages(nasaItems) {
  // Clear the gallery first
  gallery.innerHTML = '';
  
  // Take only the first 18 items to avoid overwhelming the page
  const itemsToShow = nasaItems.slice(0, 18);
  
  // Create HTML for each image or video
  itemsToShow.forEach(item => {
    // Get media data from the NASA Images API response
    const mediaData = item.data[0];
    const mediaUrl = item.links ? item.links[0].href : '';
    
    // Skip items without media
    if (!mediaUrl) return;
    
    // Check if the item is an image or video
    const isVideo = mediaData.media_type === 'video';
    
    // Create a card for each space image or video
    const mediaCard = document.createElement('div');
    mediaCard.className = 'image-card';
    
    // Use template literals to create the HTML content
    mediaCard.innerHTML = `
      ${isVideo ? 
        `<div class="video-container">
          <video src="${mediaUrl}" controls loading="lazy">
            Your browser does not support the video tag.
          </video>
          <div class="media-type-badge">🎥 VIDEO</div>
        </div>` :
        `<img src="${mediaUrl}" alt="${mediaData.title}" loading="lazy">`
      }
      <div class="image-info">
        <h3>${mediaData.title}</h3>
        <p class="image-date">${new Date(mediaData.date_created).toLocaleDateString()}</p>
        <p class="image-description">${mediaData.description ? mediaData.description.substring(0, 200) + '...' : 'No description available'}</p>
        ${mediaData.photographer ? `<p class="image-copyright">Photographer: ${mediaData.photographer}</p>` : ''}
        ${mediaData.location ? `<p class="image-location">Location: ${mediaData.location}</p>` : ''}
      </div>
    `;
    // Add the media card to the gallery
    gallery.appendChild(mediaCard);
  });
}

function modalwindow(){
  // This function is a placeholder for any modal window functionality you might want to implement
  // For now, it does nothing but can be expanded later
  console.log('Modal window function called');

}

const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modal-media');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalDescription = document.getElementById('modal-description');
const modalMetadata = document.getElementById('modal-metadata');
const closeButton = document.querySelector('.close-button');

function displayImages(nasaItems) {
  gallery.innerHTML = '';

  const itemsToShow = nasaItems.slice(0, 18);

  itemsToShow.forEach(item => {

    // Get media data from the first element in the data array
    const mediaData = item.data[0];
    // Get media URL from the first link in the links array
    const mediaUrl = item.links ? item.links[0].href : '';
    if (!mediaUrl) return;
    
    const isVideo = mediaData.media_type === 'video';
     const mediaCard = document.createElement('div');
    mediaCard.className = 'image-card';
    
    // Use template literals to create the HTML content
    mediaCard.innerHTML = `
      ${isVideo ? 
        `<div class="video-container">
          <video src="${mediaUrl}" controls loading="lazy">
            Your browser does not support the video tag.
          </video>
          <div class="media-type-badge">🎥 VIDEO</div>
        </div>` :
        `<img src="${mediaUrl}" alt="${mediaData.title}" loading="lazy">`
      }
      <div class="image-info">
        <h3>${mediaData.title}</h3>
        <p class="image-date">${new Date(mediaData.date_created).toLocaleDateString()}</p>
        <p class="image-description">${mediaData.description ? mediaData.description.substring(0, 200) + '...' : 'No description available'}</p>
        ${mediaData.photographer ? `<p class="image-copyright">Photographer: ${mediaData.photographer}</p>` : ''}
        ${mediaData.location ? `<p class="image-location">Location: ${mediaData.location}</p>` : ''}
      </div>
    `;
     mediaCard.addEventListener('click', () => {
      openModal(mediaData, mediaUrl, isVideo);
    });
    
    // Add hover effect to show it's clickable
    mediaCard.style.cursor = 'pointer';
    
    // Add the media card to the gallery
    gallery.appendChild(mediaCard);
  });
}
function openModal(mediaData, mediaUrl, isVideo) {
  // Set the modal title
  modalTitle.textContent = mediaData.title;
  
  // Set the modal date
  const formattedDate = new Date(mediaData.date_created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  modalDate.textContent = `Created: ${formattedDate}`;
  
  // Set the modal description
  modalDescription.textContent = mediaData.description || 'No description available';
  
  // Create the media element (image or video)
  if (isVideo) {
    modalMedia.innerHTML = `
      <video src="${mediaUrl}" controls autoplay>
        Your browser does not support the video tag.
      </video>
    `;
} else {
    modalMedia.innerHTML = `
      <img src="${mediaUrl}" alt="${mediaData.title}">
    `;
  }
  
  // Set additional metadata
  let metadataHTML = '';
  if (mediaData.photographer) {
    metadataHTML += `<p><strong>Photographer:</strong> ${mediaData.photographer}</p>`;
  }
  if (mediaData.location) {
    metadataHTML += `<p><strong>Location:</strong> ${mediaData.location}</p>`;
  }
  if (mediaData.keywords && mediaData.keywords.length > 0) {
    metadataHTML += `<p><strong>Keywords:</strong> ${mediaData.keywords.join(', ')}</p>`;
  }
  modalMetadata.innerHTML = metadataHTML;

  modal.style.display = 'block'; 

  document.body.style.overflow = 'hidden';
}

function closeModal() {
  // Hide the modal
  modal.style.display = 'none';
  
  // Restore body scrolling
  document.body.style.overflow = 'auto';
  
  // Stop any playing videos
  const modalVideo = modalMedia.querySelector('video');
  if (modalVideo) {
    modalVideo.pause();
  }
}
closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside the content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

// Updated modalwindow function - now actually opens a modal
function modalwindow() {
  // This function can be used to open a basic modal with custom content
  console.log('Modal window function called');
}
