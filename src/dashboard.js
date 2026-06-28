import './style.css'
import { setupCounter } from './counter.js'

// importing Google API functions from backend
import { getDocsData } from './api/googledocs.js';
import { getSheetsData } from './api/googleSheets.js';

// YOUR GOOGLE CLIENT ID FROM DEVELOPER CONSOLE
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_://googleusercontent.com';
const REDIRECT_URI = window.location.origin; // Automatically matches http://localhost:5173

// 1. INITIAL BASE RENDER
document.querySelector('#app').innerHTML = `
  <section id="center">
    <div>
      <h1>Job Application Dashboard</h1>
      <div id="auth-status"></div> <!-- Login Button / User Status goes here -->
    </div>
  </section>

  <section id="Application-Documents" style="display: none;"> <!-- Hidden until logged in -->
    <div id="docs">
      <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
      <h2>Application Resume</h2>
      <ul id="googleDocs-Application"><li>Loading Resume...</li></ul>
    </div>

    <div id="sheets">
      <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#spreadsheet-icon"></use></svg>
      <h2>Application Tracker</h2>
      <ul id="googleSheets-Application"><li>Loading Job Tracker...</li></ul>
    </div>
  </section>
`;

// 2. CHECK FOR GOOGLE REDIRECT TOKEN BEFORE DOING ANYTHING
function checkForOAuthToken() {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
      // Clean up the URL bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}

// 3. GENERATE THE URL THAT FORCES GOOGLE TO PROMPT LOGIN
function redirectToGoogleLogin() {
  const scopes = [
    'https://googleapis.com',
    'https://googleapis.com'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` + // Implicit flow for frontend apps
    `&scope=${encodeURIComponent(scopes)}` +
    `&prompt=consent`; // Explicitly forces the prompt screen

  window.location.href = authUrl;
}

// 4. MAIN CONTROLLER
async function initializeDashboard() {
  checkForOAuthToken(); // Extract token if we just redirected back
  
  const token = localStorage.getItem('google_access_token');
  const authStatus = document.querySelector('#auth-status');
  const dashboardSection = document.querySelector('#Application-Documents');

  // IF NOT LOGGED IN: Show the login button prompt
  if (!token) {
    authStatus.innerHTML = `<button id="login-btn" class="btn">Sign in with Google</button>`;
    document.querySelector('#login-btn').addEventListener('click', redirectToGoogleLogin);
    return;
  }

  // IF LOGGED IN: Show dashboard sections and run your working APIs
  authStatus.innerHTML = `<span class="badge success">🔒 Authenticated with Google</span>`;
  dashboardSection.style.display = 'flex';

  const TARGET_DOC_ID = 'YOUR_GOOGLE_DOC_ID_HERE';
  const TARGET_SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

  // Load Resumes
  try {
    const resumeData = await getDocsData(TARGET_DOC_ID);
    if (resumeData && resumeData.title) {
      document.querySelector('#googleDocs-Application').innerHTML = `
        <li><a href="https://google.com{TARGET_DOC_ID}/edit" target="_blank">${resumeData.title}</a></li>
      `;
    }
  } catch (err) {
    console.error(err);
    document.querySelector('#googleDocs-Application').innerHTML = '<li>Error loading Resume</li>';
  }

  // Load Sheets
  try {
    const trackerData = await getSheetsData(TARGET_SHEET_ID);
    if (trackerData && trackerData.properties) {
      document.querySelector('#googleSheets-Application').innerHTML = `
        <li><a href="https://google.com{TARGET_SHEET_ID}/edit" target="_blank">${trackerData.properties.title}</a></li>
      `;
    }
  } catch (err) {
    console.error(err);
    document.querySelector('#googleSheets-Application').innerHTML = '<li>Error loading Tracker</li>';
  }
}

initializeDashboard();