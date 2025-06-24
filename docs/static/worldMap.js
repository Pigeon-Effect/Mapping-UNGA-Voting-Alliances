  function toggleAlliesAndAdverseriesTable() {
    var table = document.getElementById("allyEnemyTable");
    var expandButton = document.getElementById("expandAlliesAndAdverseriesButton");

    if (table.style.display === "none") {
      table.style.display = "block";
      expandButton.style.display = "none";
    } else {
      table.style.display = "none";
      expandButton.style.display = "block";
    }
  }

  function toggleFormalAllianceTable() {
    var table = document.getElementById("formalAllianceTable");
    var expandButton = document.getElementById("expandFormalAllianceButton");

    if (table.style.display === "none") {
      table.style.display = "block";
      expandButton.style.display = "none";
    } else {
      table.style.display = "none";
      expandButton.style.display = "block";
    }
  }



function initializeWorldMap(data) {

// Define your SVG and other D3 settings
  var svg = d3.select("#worldMap svg")
          .attr("width", window.innerWidth)
          .attr("height", window.innerHeight),
      width = window.innerWidth,
      height = window.innerHeight;

// Adjust the scaling factor for the projection
  var projection = d3.geoAitoff()
      .scale((width / 2.5) / Math.PI) // Adjust the scale factor as needed
      .translate([width / 2, height / 2]);

  var zoom = d3.zoom()
      .scaleExtent([1, 1000])
      .on("zoom", zoomed);

  svg.call(zoom);

  var tooltipWorldMap = d3.select(".tooltipWorldMap");

  function zoomed() {
    svg.selectAll('path')
        .attr('transform', d3.event.transform);
  }

  // Append legend container inside the worldMap section
  var legend = d3.select("#worldMap").append("svg")
      .attr("class", "legend");


  // Create the gradient for the color scale
  var gradient = legend.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

  // Define the gradient stops
  for (var i = 0; i <= 1; i += 0.01) {
    gradient.append("stop")
        .attr("offset", i * 100 + "%")
        .attr("stop-color", d3.interpolateViridis(i));
  }

  // Append the gradient rect (the rectangle is styled by CSS now)
  legend.append("rect")
      .attr("x", 0)
      .attr("y", 20);  // Adjust position dynamically

  // Create the scale for the legend axis
  var legendScale = d3.scaleLinear()
      .domain([0, 1])
      .range([300, 0]);

  // Create the axis for the legend
  var legendAxis = d3.axisRight(legendScale)
      .ticks(10)
      .tickFormat(d3.format(".1f"));

  // Append the axis to the legend
  legend.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(40, 20)") // Adjust position for the axis
      .call(legendAxis);

  // Remove the axis line
  legend.select(".domain").remove();



// Function to update the selected country info display
  function updateSelectedCountryInfo(selectedCountryName, selectedCountryCode, geoData) {
    var infoValue = document.querySelector(".selected-country-info .info-value");
    infoValue.textContent = selectedCountryName; // Update the country name in the info box

    var countryFeature = geoData.features.find(feature => feature.properties.A3 === selectedCountryCode);
    if (countryFeature) {
      var twoLetterCode = countryFeature.properties.A2;
      var countryFlag = document.querySelector(".selected-country-info .country-flag");
      countryFlag.src = `static/country_flags/${twoLetterCode.toLowerCase()}.svg`;
      countryFlag.alt = `Flag of ${selectedCountryName}`;
    } else {
      console.error("Country code not found in geoData:", selectedCountryCode);
    }
  }


// Function to update the coincidence table
  function updateCoincidenceTable(weightMap, geoData, selectedCountry) {
    var sortedCountries = Object.keys(weightMap)
      .filter(countryCode => countryCode !== selectedCountry && !isNaN(weightMap[countryCode])) // Filter out NaN values
      .sort((a, b) => weightMap[b] - weightMap[a]); // Sort by the weight values

    var topTen = sortedCountries.slice(0, 10);
    var bottomTen = sortedCountries.slice(-10);

    var tableHtml = '';

    topTen.forEach(function (countryCode) {
      var countryFeature = geoData.features.find(feature => feature.properties.A3 === countryCode);
      if (countryFeature) {
        var countryName = countryFeature.properties.country_name;
        var twoLetterCode = countryFeature.properties.A2;
        tableHtml += `<tr><td><img src="static/country_flags/${twoLetterCode.toLowerCase()}.svg" alt="Flag of ${countryName}" style="width: 20px; height: 20px; margin-right: 5px;">${countryName}</td><td class="coincidence-number">${weightMap[countryCode].toFixed(5)}</td></tr>`;
      } else {
        console.error("Country code not found in geoData:", countryCode);
      }
    });

    tableHtml += '<tr><td colspan="2">...</td></tr>';

    bottomTen.forEach(function (countryCode) {
      var countryFeature = geoData.features.find(feature => feature.properties.A3 === countryCode);
      if (countryFeature) {
        var countryName = countryFeature.properties.country_name;
        var twoLetterCode = countryFeature.properties.A2;
        tableHtml += `<tr><td><img src="static/country_flags/${twoLetterCode.toLowerCase()}.svg" alt="Flag of ${countryName}" style="width: 20px; height: 20px; margin-right: 5px;">${countryName}</td><td class="coincidence-number">${weightMap[countryCode].toFixed(5)}</td></tr>`;
      } else {
        console.error("Country code not found in geoData:", countryCode);
      }
    });

    var tableBody = document.querySelector("#allyEnemyTable tbody");
    tableBody.innerHTML = tableHtml;
  }


  let csvData = data;

  function calculateInternalCoincidence(allianceMembers, weightMap) {
    let totalCoincidence = 0;
    let memberCount = 0;

    // Loop through all pairs of alliance members
    for (let i = 0; i < allianceMembers.length; i++) {
      for (let j = i + 1; j < allianceMembers.length; j++) {
        const memberA = allianceMembers[i];
        const memberB = allianceMembers[j];

        // Find the corresponding weight (source-target or target-source)
        const pair = weightMap.find(entry =>
          (entry.source === memberA && entry.target === memberB) ||
          (entry.source === memberB && entry.target === memberA)
        );

        // If a valid numeric weight exists, add it to the total
        if (pair && !isNaN(parseFloat(pair.weight))) {
          totalCoincidence += parseFloat(pair.weight);
          memberCount++;
        }
      }
    }

    // Return the average if there are valid pairs, otherwise "0.00000"
    return memberCount > 0 ? (totalCoincidence / memberCount).toFixed(5) : "0.00000";
  }










  const alliances = {
    "European Union": ["DEU", "FRA", "ITA", "ESP", "BEL", "NLD", "AUT", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "GRC", "HUN", "IRL", "LVA", "LTU", "LUX", "MLT", "POL", "PRT", "ROU", "SVK", "SVN", "SWE"],
    "ASEAN": ["IDN", "MYS", "PHL", "SGP", "THA", "VNM", "BRN", "KHM", "LAO", "MMR"],
    "ECOWAS": ["BEN", "BFA", "CPV", "CIV", "GMB", "GHA", "GIN", "GNB", "LBR", "MLI", "NER", "NGA", "SEN", "SLE", "TGO"],
    "OECD": ["AUS", "AUT", "BEL", "CAN", "CHL", "COL", "CZE", "DNK", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ISR", "ITA", "JPN", "KOR", "LVA", "LTU", "LUX", "MEX", "NLD", "NZL", "NOR", "POL", "PRT", "SVK", "SVN", "ESP", "SWE", "CHE", "TUR", "GBR", "USA"],
    "NATO": ["ALB", "BEL", "BGR", "CAN", "HRV", "CZE", "DNK", "EST", "FRA", "DEU", "GRC", "HUN", "ISL", "ITA", "LVA", "LTU", "LUX", "NLD", "NOR", "FIN", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "TUR", "GBR", "USA"],
    "BRICS": ["BRA", "RUS", "IND", "CHN", "ZAF", "ETH", "EGY", "ARE", "IRN"],
    "SCO": ["CHN", "IND", "KAZ", "KGZ", "PAK", "RUS", "TJK", "UZB", "IRN"],
    "Commonwealth": ["AUS", "BHS", "BGD", "BRB", "BLZ", "BWA", "CMR", "CAN", "CYP", "DMA", "FJI", "GMB", "GHA", "GRD", "GUY", "IND", "JAM", "KEN", "KIR", "LSO", "MWI", "MYS", "MDV", "MLT", "MUS", "MOZ", "NAM", "NRU", "NZL", "NGA", "PAK", "PNG", "RWA", "WSM", "SGP", "SLB", "ZAF", "LKA", "SWZ", "TZA", "TON", "TTO", "TUV", "UGA", "VUT", "ZMB"],
    "African Union": ["DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CPV", "CMR", "CAF", "TCD", "COM", "COG", "CIV", "COD", "DJI", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB", "GMB", "GHA", "GIN", "GNB", "KEN", "LSO", "LBR", "LBY", "MDG", "MWI", "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA", "RWA", "STP", "SEN", "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA", "TGO", "TUN", "UGA", "ZMB", "ZWE"],
    "Mercosur": ["ARG", "BRA", "PRY", "URY", "VEN"],
    "Arab League": ["DZA", "BHR", "COM", "DJI", "EGY", "IRQ", "JOR", "KWT", "LBN", "LBY", "MRT", "MAR", "OMN", "PSE", "QAT", "SAU", "SOM", "SDN", "SYR", "TUN", "ARE", "YEM"],
    "OPEC": ["DZA", "AGO", "CIV", "IRN", "IRQ", "KWT", "LBY", "NGA", "SAU", "ARE", "VEN"],
    "G77": ["AFG", "AGO", "ATG", "BHS", "BHR", "BGD", "BRB", "BLZ", "BTN", "BOL", "BWA", "BRA", "BRN", "BGR", "KHM", "CMR", "CPV", "CAF", "TCD", "CHL", "CHN", "COL", "COM", "COD", "COG", "CRI", "CIV", "CUB", "CYP", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "ETH", "FJI", "GAB", "GMB", "GHA", "GRD", "GTM", "GIN", "GNB", "GUY", "HTI", "HND", "IND", "IDN", "IRN", "IRQ", "JAM", "JOR", "KEN", "KIR", "PRK", "KWT", "LAO", "LBN", "LSO", "LBR", "LBY", "MDG", "MWI", "MYS", "MDV", "MLI", "MRT", "MUS", "MEX", "MNG", "MNE", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NIC", "NER", "NGA", "OMN", "PAK", "PLW", "PAN", "PNG", "PRY", "PER", "PHL", "QAT", "RWA", "KNA", "LCA", "VCT", "WSM", "STP", "SAU", "SEN", "SYC", "SLE", "SGP", "SLB", "SOM", "ZAF", "SSD", "LKA", "SDN", "SUR", "SWZ", "SYR", "TJK", "TZA", "THA", "TLS", "TGO", "TON", "TTO", "TUN", "TKM", "UGA", "ARE", "URY", "UZB", "VUT", "VEN", "VNM", "YEM", "ZMB", "ZWE"],
    "G7": ["CAN", "FRA", "DEU", "ITA", "JPN", "GBR", "USA"],
    "All Countries": ["AFG", "ALB", "DZA", "AND", "AGO", "ATG", "ARG", "ARM", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BTN", "BOL", "BIH", "BWA", "BRA", "BRN", "BGR", "BFA", "BDI", "CPV", "KHM", "CMR", "CAN", "CAF", "TCD", "CHL", "CHN", "COL", "COM", "COD", "COG", "CRI", "CIV", "HRV", "CUB", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "ETH", "FJI", "FIN", "FRA", "GAB", "GMB", "GEO", "DEU", "GHA", "GRC", "GRD", "GTM", "GIN", "GNB", "GUY", "HTI", "HND", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "ISR", "ITA", "JAM", "JPN", "JOR", "KAZ", "KEN", "KIR", "KOR", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MRT", "MUS", "MEX", "MDA", "MCO", "MNG", "MNE", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NZL", "NIC", "NER", "NGA", "MKD", "NOR", "OMN", "PAK", "PLW", "PAN", "PNG", "PRY", "PER", "PHL", "POL", "PRT", "QAT", "ROU", "RUS", "RWA", "KNA", "LCA", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SRB", "SYC", "SLE", "SGP", "SVK", "SVN", "SLB", "SOM", "ZAF", "SSD", "ESP", "LKA", "SDN", "SUR", "SWZ", "SWE", "CHE", "SYR", "TJK", "TZA", "THA", "TLS", "TGO", "TON", "TTO", "TUN", "TUR", "TKM", "UGA", "UKR", "ARE", "GBR", "USA", "URY", "UZB", "VUT", "VEN", "VNM", "YEM", "ZMB", "ZWE"],
    "CIS": ["ARM", "AZE", "BLR", "KAZ", "KGZ", "MDA", "RUS", "TJK", "TKM", "UZB"],
    "OSCE": ["ALB", "AND", "ARM", "AUT", "AZE", "BLR", "BEL", "BIH", "BGR", "CAN", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA", "GEO", "DEU", "GRC", "HUN", "ISL", "IRL", "ITA", "KAZ", "KGZ", "LVA", "LIE", "LTU", "LUX", "MLT", "MDA", "MCO", "MNE", "NLD", "MKD", "NOR", "POL", "PRT", "ROU", "RUS", "SMR", "SRB", "SVK", "SVN", "ESP", "SWE", "CHE", "TJK", "TUR", "TKM", "UKR", "USA", "UZB"],
    "G33": ["ARG", "BLZ", "BOL", "BRA", "CHL", "CHN", "COL", "CRI", "CUB", "ECU", "GTM", "HND", "IND", "IDN", "JAM", "KEN", "KOR", "MYS", "MEX", "NIC", "PAK", "PAN", "PRY", "PER", "PHL", "DOM", "STP", "SUR", "TTO", "URY", "VEN", "ZWE"],
    "CELAC": ["ARG", "BHS", "BRB", "BLZ", "BOL", "BRA", "CHL", "COL", "CRI", "CUB", "DMA", "DOM", "ECU", "SLV", "GRD", "GTM", "GUY", "HTI", "HND", "JAM", "MEX", "NIC", "PAN", "PRY", "PER", "LCA", "VCT", "SUR", "TTO", "URY", "VEN"],
    "OIC": ["AFG", "ALB", "DZA", "AZE", "BHR", "BGD", "BEN", "BRN", "BFA", "CMR", "TCD", "COM", "CIV", "DJI", "EGY", "GAB", "GMB", "GIN", "GNB", "GUY", "IDN", "IRN", "IRQ", "JOR", "KAZ", "KEN", "KWT", "KGZ", "LBN", "LBY", "MYS", "MDV", "MLI", "MRT", "MAR", "MOZ", "NER", "NGA", "OMN", "PAK", "PSE", "QAT", "SAU", "SEN", "SLE", "SOM", "SSD", "SDN", "SUR", "SYR", "TGO", "TUN", "TUR", "TKM", "UGA", "ARE", "UZB", "YEM"]
  };



// Initialize the formal alliance table
  function initializeFormalAllianceTable(csvData) {
    const allianceTableBody = document.querySelector("#formalAllianceTable tbody");
    const formalAllianceCoincidences = Object.keys(alliances).map(alliance => {
      const internalCoincidence = calculateInternalCoincidence(alliances[alliance], csvData);
      return {alliance, internalCoincidence};
    });

    formalAllianceCoincidences.sort((a, b) => b.internalCoincidence - a.internalCoincidence);

    let tableHtml = '';
    formalAllianceCoincidences.forEach(entry => {
      tableHtml += `<tr><td><button class="alliance-button" onclick="highlightAlliance('${entry.alliance}')">${entry.alliance}</button></td><td class="internal-coincidence">${entry.internalCoincidence}</td></tr>`;
    });

    allianceTableBody.innerHTML = tableHtml;
  }


  initializeFormalAllianceTable(csvData)

  Promise.all([
    data,
    d3.json("static/world_with_country_names.geojson")
  ]).then(function ([csvData, geoData]) {

    var colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, 1]);

    function updateMap(selectedCountry) {
      var weightMap = {};

      csvData.forEach(function (d) {
        if (d.source === selectedCountry || d.target === selectedCountry) {
          var otherCountry = d.source === selectedCountry ? d.target : d.source;
          weightMap[otherCountry] = +d.weight;
        }
      });

      weightMap[selectedCountry] = 1.0; // Self-coincidence weight

    svg.selectAll("path")
      .attr("fill", function (d) {
        var countryCode = d.properties.A3;

        // Highlight the selected country in red
        if (countryCode === selectedCountry) {
          return "#ff0000";
        }

        // Get the weight of the country from the weightMap
        var weight = weightMap[countryCode];

        // Check if the weight is NM, and color grey if true
        if (weight === "NM" || isNaN(weight)) {
          return "#878787"; // Color grey for "No Member"
        }

        // Default fill logic for countries with valid weights
        return weight === undefined ? "#878787" : colorScale(weight);
      });


      // Update the coincidence table, passing geoData as a parameter
      updateCoincidenceTable(weightMap, geoData, selectedCountry);
    }

  function onCountryClick(d) {
    var selectedCountryCode = d.properties.A3;
    var selectedCountryName = d.properties.country_name;

    // Update the map with the selected country
    updateMap(selectedCountryCode);

    // Update the displayed selected country information
    updateSelectedCountryInfo(selectedCountryName, selectedCountryCode, geoData);

    // Update the tooltip to show the new selected country's data on hover
    svg.selectAll(".country")
      .on("mouseover", function (hoveredCountry) {
        var hoverCountryCode = hoveredCountry.properties.A3;
        var weight = 1.0; // Default weight for the country itself
        if (hoverCountryCode !== selectedCountryCode) {
          var weightEntry = csvData.find(cd =>
            (cd.source === hoverCountryCode && cd.target === selectedCountryCode) ||
            (cd.source === selectedCountryCode && cd.target === hoverCountryCode));
          weight = weightEntry && !isNaN(weightEntry.weight) ? +weightEntry.weight : "NM";
        }
        weight = weight !== "NM" ? weight.toFixed(5) : weight;

        tooltipWorldMap.html(`
          <div style="display: flex; align-items: center;">
            <img src="static/country_flags/${hoveredCountry.properties.A2.toLowerCase()}.svg" 
                 alt="Flag of ${hoveredCountry.properties.country_name}" 
                 style="border: 1px solid black; border-radius: 50%; width: 40px; height: 40px; margin-right: 10px;"/>
            <div>
              <strong>${hoveredCountry.properties.country_name}</strong>
              <br>
              <br>
              <div>Coincidence with ${selectedCountryName}: ${weight}</div>
            </div>
          </div>
        `)
        .style("visibility", "visible")
        .style("box-shadow", "8px 8px 8px rgba(0, 0, 0, 0.4)")  // Add shadow
        .style("border", "1px solid #ccc")  // Optional: add border for better separation
        .style("background-color", "white");  // Ensure the tooltip has a solid background

        d3.select(this).raise(); // Bring the current element to the front
      });
  }





    updateMap("ATA");
    updateSelectedCountryInfo("Antarctica", "ATA", geoData);

var countryPaths = svg.append("g")
    .selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", function (d) {
      var countryCode = d.properties.A3;
      // Default color: grey
      // Special color for Antarctica (ATA) as an example
      return countryCode === "ATA" ? "#ff0000" : "#878787";
    })
    .on("mouseover", function (d) {
      var countryCode = d.properties.A3;
      var countryName = d.properties.country_name;
      var iso2Code = d.properties.A2; // ISO 2 code for the flag image
      var weight = 1.0; // Default weight for the country itself

      if (countryCode !== "ATA") {
        var weightEntry = csvData.find(cd =>
          (cd.source === countryCode && cd.target === "ATA") ||
          (cd.source === "ATA" && cd.target === countryCode)
        );
        weight = weightEntry ? +weightEntry.weight : "No UN-Membership";
      }

      weight = weight !== "No UN-Membership" ? weight.toFixed(5) : weight;

      // Format the tooltip content
      var tooltipContent = `
        <div style="display: flex; align-items: center;">
          <img src="static/country_flags/${iso2Code.toLowerCase()}.svg" 
               alt="Flag of ${countryName}" 
               style="border: 1px solid black; border-radius: 50%; width: 40px; height: 40px; margin-right: 10px;"/>
          <div>
            <strong>${countryName}</strong>
            <br><br>
            Coincidence with Antarctica: ${weight}
          </div>
        </div>
      `;

      // Set tooltip HTML content, make it visible, and add shadow
      tooltipWorldMap.html(tooltipContent)
        .style("visibility", "visible")
        .style("box-shadow", "8px 8px 8px rgba(0, 0, 0, 0.4)")  // Add shadow
        .style("border", "1px solid #ccc")  // Optional: add border for better separation
        .style("background-color", "white");  // Ensure the tooltip has a solid background

      // Bring the current country to the front for better visibility
      d3.select(this).raise();
    })
    .on("mousemove", function () {
      tooltipWorldMap
        .style("top", (d3.event.pageY - 20) + "px")
        .style("left", (d3.event.pageX + 20) + "px");
    })
    .on("mouseout", function () {
      // Hide the tooltip when not hovering
      tooltipWorldMap.style("visibility", "hidden");
    })
    .on("click", onCountryClick); // Use the updated onCountryClick function


  });

}

window.addEventListener('globalVotingSimilarityReady', (event) => {
    const data = event.detail.data;
    initializeWorldMap(data);
});
