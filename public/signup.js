// **IMPORTANT:** Replace with your Supabase URL and Anon Key
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co'; // Find this in your Supabase dashboard
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

// DOM elements
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');
const fullNameInput = document.getElementById('full_name');
const websiteInput = document.getElementById('website');
const resultDiv = document.getElementById('result');

// Direct Supabase signup using fetch
async function directSignup(email, password, username, full_name, website) {
    const url = `${supabaseUrl}/auth/v1/signup`;
    const headers = {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`, // Important for Supabase Auth
    };

    const body = JSON.stringify({
        email,
        password,
        // Add user metadata
        data: {
            username,   // Store the username
            full_name,  // Store the full name
            website     // Store the website
        },
        options: {
            data: {
              username,
              full_name,
              website
            }
        }
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle errors (e.g., email already exists, invalid password)
            console.error('Signup failed:', data);
            resultDiv.innerHTML = `<div class="error">Signup failed: ${data.message || 'Unknown error'}</div>`;
            return;
        }

        // Signup successful!
        console.log('Signup successful:', data);
        resultDiv.innerHTML = `<div class="success">Signup successful! User ID: ${data.user.id}</div>`;

        // Automatically sign in the user after successful signup
        await autoSignIn(email, password);

    } catch (error) {
        console.error('Fetch error:', error);
        resultDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Automatic sign-in after signup
async function autoSignIn(email, password) {
    const tokenUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`;
    const tokenHeaders = {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
    };
    const tokenBody = JSON.stringify({
        email,
        password
    });

    try {
        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: tokenHeaders,
            body: tokenBody
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            // Handle error (though this should rarely happen if signup succeeded)
            return;
        }

        // Store the access token and refresh token (e.g., in local storage or cookies)
        localStorage.setItem('supabaseAccessToken', tokenData.access_token);
        localStorage.setItem('supabaseRefreshToken', tokenData.refresh_token);

        // Now the user is signed in! Redirect or update UI.
        console.log("User signed in", tokenData);
        // Redirect to a dashboard or profile page
        window.location.href = '/dashboard.html'; // Example: Redirect to dashboard.html

    } catch (tokenError) {
        console.error('Token exchange error:', tokenError);
        // Handle error
    }
}

// Handle form submission
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;
    const full_name = fullNameInput.value;
    const website = websiteInput.value;

    await directSignup(email, password, username, full_name, website);
}); 