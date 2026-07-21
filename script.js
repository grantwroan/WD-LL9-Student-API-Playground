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
            v5 requires an API key sent as an Authorization header.
            Your key lives in config.js (git-ignored, not in this repo)
            which sets window.API_KEY before this file runs.
            See config.example.js for the template.
         ------------------------------------------------------------ */
       const API_KEY = window.API_KEY || "";
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
     console.log(country);

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
            Confirmed from a real v5 response: country.flag.url_png
         ------------------------------------------------------------ */
       flagImg.src = country.flag.url_png;
         flagImg.alt = `Flag of ${country.names.common}`;

       /* ------------------------------------------------------------
            STEP 8: Display Capital, Region, Population
            ------------------------------------------------------------
            Confirmed from a real v5 response:
            - country.capitals is an ARRAY OF OBJECTS: capitals[0].name
            - country.region is a plain string
            - country.population is a raw number
         ------------------------------------------------------------ */
       capitalEl.textContent = country.capitals[0].name;
         regionEl.textContent = country.region;
         populationEl.textContent = country.population.toLocaleString();

       /* ------------------------------------------------------------
            STEP 9: Display Languages
            ------------------------------------------------------------
            Confirmed from a real v5 response: country.languages is an
            ARRAY of objects (not a map), each with a .name property, e.g.:
            [{ name: "English", ... }, { name: "French", ... }]
         ------------------------------------------------------------ */
       languagesEl.textContent = country.languages
           .map(function (lang) { return lang.name; })
           .join(", ");

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
