document.addEventListener("DOMContentLoaded", function() {
  const runBtn = document.getElementById("runBtn");
  const nav = document.querySelector(".nav");
  const backToLandingPageBtn = document.getElementById("backToLandingPageBtn");

  // Time Period Slider Elements
  const startYearLabel = document.getElementById("startYear");
  const endYearLabel = document.getElementById("endYear");

  // Subject Buttons and Selected Subject Variable
  let selectedSubject = 'All Resolutions'; // Default selection
  let globalVotingSimilarityResults = [];
  let filteredData = []; // Store filtered data globally

  const subjectButtons = document.querySelectorAll(".subject-btn");
  subjectButtons.forEach(button => {
    button.addEventListener("click", function() {
      selectedSubject = button.dataset.subject;

      // Update button classes
      subjectButtons.forEach(btn => {
        if (btn.dataset.subject === selectedSubject) {
          btn.classList.add('active'); // Add active class to selected button
        } else {
          btn.classList.remove('active'); // Remove active class from others
        }
      });
    });
  });

  // Initialize "All Resolutions" button as active
  document.querySelector('.subject-btn[data-subject="All Resolutions"]').classList.add('active');


  // Initialize noUiSlider for time period
  const timePeriodSlider = document.getElementById('timePeriodSlider');
  noUiSlider.create(timePeriodSlider, {
    start: [1946, 2024],
    connect: true,
    range: {
      'min': 1946,
      'max': 2024
    },
    step: 1,
    tooltips: true,
    format: {
      to: function(value) {
        return Math.round(value);
      },
      from: function(value) {
        return Number(value);
      }
    }
  });

  // Update the year labels as the slider values change
  timePeriodSlider.noUiSlider.on('update', function(values) {
    const startYear = Math.round(values[0]);
    const endYear = Math.round(values[1]);
    startYearLabel.textContent = startYear;
    endYearLabel.textContent = endYear;
  });

  // Run button event listener
  runBtn.addEventListener("click", function() {
    const selectedStartYear = parseInt(startYearLabel.textContent);
    const selectedEndYear = parseInt(endYearLabel.textContent);

    // Show the loading spinner
    document.getElementById("loadingSpinner").style.display = "flex";
    console.log("loadingSpinner should start here")

    // Show the navigation bar and the "Back to Landing Page" button
    nav.style.display = "flex";
    backToLandingPageBtn.style.display = "block";

    // Filter the CSV data based on the selected year range and subject
    filterCSVByDateAndSubject(selectedStartYear, selectedEndYear, selectedSubject);
    // Hide the landing page from view
  });

  // Back to landing page functionality
  backToLandingPageBtn.addEventListener("click", function() {
    window.location.reload();
  });

  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";

    document.querySelectorAll('.nav button').forEach(button => {
      button.classList.remove('active');
    });
    document.getElementById(sectionId + 'Btn').classList.add('active');
  }

  function filterCSVByDateAndSubject(startYear, endYear, subject) {
    Papa.parse("static/ungaVoting_003.csv", {
      download: true,
      header: true,
      complete: function(results) {
        // Step 1: Filter by date range
        filteredData = results.data.filter(row => {
          const rowDate = new Date(row.date);
          const rowYear = rowDate.getFullYear();
          return rowYear >= startYear && rowYear <= endYear;
        });

        // Step 2: Filter by subject
        if (subject !== "All Resolutions") {
          const subjectMapping = {
            "Disarmament": "di",
            "Nuclear Disarmament": "nu",
            "Middle East": "me",
            "Economic Development": "co",
            "Human Rights": "hr",
            "Environment": "ec"
          };

          const subjectColumn = subjectMapping[subject];

          if (subjectColumn) {
            filteredData = filteredData.filter(row => row[subjectColumn] === "TRUE");
          } else {
            console.error("Subject not found in mapping:", subject);
            return;
          }
        }

        console.log("Selected Subject:", subject);
        console.log("Number of Resolutions after filtering:", filteredData.length);

        // Show the world map section
        showSection('worldMap');

        // Run the voting similarity calculation
        calculateVotingSimilarity(filteredData);
      }
    });
  }

  function calculateVotingSimilarity(filteredData) {
    const isoColumns = Object.keys(filteredData[0]).slice(8);
    let results = [];

    for (let i = 0; i < isoColumns.length; i++) {
      for (let j = i + 1; j < isoColumns.length; j++) {
        const country1 = isoColumns[i];
        const country2 = isoColumns[j];
        let totalCoincidence = 0;
        let validResolutions = 0;

        let country1NoMember = true;
        let country2NoMember = true;

        filteredData.forEach(row => {
          const vote1 = parseInt(row[country1]);
          const vote2 = parseInt(row[country2]);

          if (vote1 !== 9) {
            country1NoMember = false;
          }
          if (vote2 !== 9) {
            country2NoMember = false;
          }

          if (vote1 === 8 || vote2 === 8 || vote1 === 9 || vote2 === 9) {
            return;
          }

          const coincidence = calculateCoincidence(vote1, vote2);
          totalCoincidence += coincidence;
          validResolutions += 1;
        });

        let weight;
        if (country1NoMember || country2NoMember) {
          weight = "NM";
        } else {
          weight = validResolutions > 0 ? totalCoincidence / validResolutions : "No Data";
        }

        results.push({
          source: country1,
          target: country2,
          weight: weight
        });
      }
    }

    window.globalVotingSimilarityResults = results;

    // Dispatch a custom event with the data
    const event = new CustomEvent('globalVotingSimilarityReady', { detail: { data: window.globalVotingSimilarityResults } });
    window.dispatchEvent(event);

    console.log("Voting Similarity Results:", results);

    // Hide the loading spinner after calculations are done
    document.getElementById("loadingSpinner").style.display = "none";
  }

  function calculateCoincidence(vote1, vote2) {
    if (vote1 === vote2) {
      return 1;
    } else if (vote1 === 2 || vote2 === 2) {
      return 0.5;
    } else {
      return 0;
    }
  }

  // Expose the showSection function globally
  window.showSection = showSection;
});
