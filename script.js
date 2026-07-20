/* ============================================================
   COUNTRY EXPLORER — script.js
   ------------------------------------------------------------
   THE PATTERN (this is the whole lab):
     1. Get user input
     2. Fetch data from an API
     3. Convert the response to JSON
     4. Pull the piece of data you need off the response
     5. Drop it into the page with .textContent / .src

   Steps 1-6 below are built together as an instructor demo.
   Steps 7-10 are your team's mission — they reuse the exact
   same pattern shown in Step 6, just with different data.
============================================================ */

// --- Element references (grab everything once, up front) -----
const searchBtn = document.getElementById("searchBtn");
const countryInput = document.getElementById("countryInput");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("errorMessage");
const resultCard = document.getElementById("resultCard");

const flagImg = document.getElementById("flagImg");
const countryNameEl = document.getElementById("countryName");
const capitalEl = document.getElementById("capitalValue");
const regionEl = document.getElementById("regionValue");
const populationEl = document.getElementById("populationValue");
const languagesEl = document.getElementById("languagesValue");

/* ------------------------------------------------------------
   STEP 1: Connect the button's click event.
------------------------------------------------------------ */
searchBtn.addEventListener("click", fetchCountry);

/* ------------------------------------------------------------
   STEP 2: Create fetchCountry()
------------------------------------------------------------ */
async function fetchCountry() {
     const countryName = countryInput.value.trim();
     if (!countryName) return; // nothing typed, nothing to do

  /* ------------------------------------------------------------
        STEP 3: Show "Loading..."
     ------------------------------------------------------------ */
  showLoading();

  try {
         /* ------------------------------------------------------------
            STEP 4: Build the fetch request
            ------------------------------------------------------------
            The old v3.1 API is retired. v5 requires an API key sent as
            an Authorization header, and (for browser requests) your
            API key must allow-list your origin (127.0.0.1 / localhost/ or your live preview url without the HTTPS)
            on the API Keys page at restcountries.com.
         ------------------------------------------------------------ */
       const API_KEY = "";
         const url =
                  `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryName)}` +
                  `&response_fields=names.common,capitals,region,population,languages,flag.url_png,flag.description`;

       const response = await fetch(url, {
                headers: { Authorization: `Bearer ${API_KEY}` },
       });

       if (!response.ok) {
                throw new Error("Country not found");
       }

       /* ------------------------------------------------------------
            STEP 5: Convert response -> JSON
            ------------------------------------------------------------
            v5 wraps results in { data: { objects: [...] } }
         ------------------------------------------------------------ */
       const data = await response.json();
         const objects = data.data.objects;

       if (!objects || objects.length === 0) {
                throw new Error("Country not found");
       }

       const country = objects[0];

       /* ------------------------------------------------------------
            STEP 6: Display ONE property. Start simple.
            Display only: Country Name.
         ------------------------------------------------------------ */
       countryNameEl.textContent = country.names.common;

       /* ============================================================
            TEAM BUILD STARTS HERE
            The instructor demo stops at Step 6. Steps 7-10 are your
            team's mission. Use the exact pattern from Step 6 above.
         ============================================================ */

       /* ------------------------------------------------------------
            STEP 7: Display the Flag
            ------------------------------------------------------------
            - flag image lives at: country.flag.url_png (v5 field)
            - Set flagImg.src to that URL
            - Set flagImg.alt to something descriptive
         ------------------------------------------------------------ */
       flagImg.src = country.flag.url_png;
         flagImg.alt = `Flag of ${country.names.common}`;

       /* ------------------------------------------------------------
            STEP 8: Display Capital, Region, Population
            ------------------------------------------------------------
            - Capital: country.capitals[0] <-- v5 uses "capitals" (ARRAY)
            - Region: country.region
            - Population: country.population <-- a raw number
              number.toLocaleString() formats 129000000 as "129,000,000"
         ------------------------------------------------------------ */
       capitalEl.textContent = country.capitals[0];
         regionEl.textContent = country.region;
         populationEl.textContent = country.population.toLocaleString();

       /* ------------------------------------------------------------
            STEP 9: Display Languages
            ------------------------------------------------------------
            - country.languages is an OBJECT, not an array, e.g.:
              { fra: "French", eng: "English" }
            - Object.values(country.languages) turns that into an
              array of names: ["French", "English"]
            - .join(", ") turns that array into one readable string
         ------------------------------------------------------------ */
       languagesEl.textContent = Object.values(country.languages).join(", ");

       /* ------------------------------------------------------------
            STEP 10a: Improve the experience — clean up on SUCCESS
         ------------------------------------------------------------ */
       hideLoading();
         resultCard.classList.remove("hidden");
         errorEl.classList.add("hidden");
  } catch (error) {
         /* ------------------------------------------------------------
            STEP 10b: Improve the experience — error handling
         ------------------------------------------------------------ */
       hideLoading();
         resultCard.classList.add("hidden");
         errorEl.textContent = `We couldn't find "${countryName}". Check the spelling and try again.`;
         errorEl.classList.remove("hidden");
         console.error(error);
  }
}

/* ------------------------------------------------------------
   Helper functions — already built for you.
------------------------------------------------------------ */
function showLoading() {
     loadingEl.classList.remove("hidden");
     errorEl.classList.add("hidden");
     resultCard.classList.add("hidden");
}

function hideLoading() {
     loadingEl.classList.add("hidden");
}
