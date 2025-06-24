let selectedCountryISO = 'CHN';
let selectedAttribute = 'Freedom House Index';

function createCoincidenceTableWithDots(data) {
    Promise.all([
        data,
        d3.csv("static/correlates_of_coincidence.csv")
    ]).then(data => {
        const edgeListData = data[0];
        const correlationMatrixData = data[1];

        // Create a map of country names to ISO codes
        const countryMap = {};
        correlationMatrixData.forEach(d => {
            countryMap[d['Country Name']] = d['ISO 3'];
        });

        const searchInput = document.getElementById('countrySearch');
        searchInput.style.lineHeight = '40px'; // Adjust line-height to match the flag height
        searchInput.style.marginLeft = '80px'; // Adjust left margin
        searchInput.style.fontFamily = '"Lucida Console", Monaco, monospace'; // Apply font family
        searchInput.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Background color
        searchInput.style.border = '1px solid #ddd'; // Border
        searchInput.style.borderRadius = '5px'; // Border radius


        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.setAttribute('id', 'suggestions');
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.top = '60px';
        suggestionsContainer.style.left = '80px';
        suggestionsContainer.style.backgroundColor = 'white';
        suggestionsContainer.style.border = '1px solid #ccc';
        suggestionsContainer.style.zIndex = 1000;
        document.getElementById('searchBarContainer').appendChild(suggestionsContainer);

        // Create the flag image element
        const countryFlag = document.createElement('img');
        countryFlag.setAttribute('id', 'countryFlag');
        countryFlag.style.width = '40px';  // Adjust size as needed
        countryFlag.style.height = '40px'; // Adjust size as needed
        countryFlag.style.marginLeft = '10px';
        countryFlag.style.border = '1px solid black'; // Black border
        countryFlag.style.borderRadius = '50%'; // Circular border
        countryFlag.style.objectFit = 'cover';
        countryFlag.style.verticalAlign = 'middle'; // Align with the middle of the text

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            suggestionsContainer.innerHTML = '';

            Object.keys(countryMap).filter(name => name.toLowerCase().includes(query)).forEach(countryName => {
                const suggestion = document.createElement('div');
                suggestion.innerText = countryName;
                suggestion.style.padding = '5px';
                suggestion.style.cursor = 'pointer';
                suggestion.addEventListener('click', () => {
                    searchInput.value = countryName;
                    suggestionsContainer.innerHTML = '';
                    selectedCountryISO = countryMap[countryName];
                    updateChart(selectedCountryISO, selectedAttribute);
                    displayR2(selectedCountryISO, selectedAttribute);
                    displaySpearman(selectedCountryISO, selectedAttribute);

                    // Update flag source
                    const iso2Code = correlationMatrixData.find(d => d['ISO 3'] === selectedCountryISO)['ISO 2'];
                    countryFlag.src = `static/country_flags/${iso2Code.toLowerCase()}.svg`;
                    countryFlag.alt = `Flag of ${countryName}`;

                });
                suggestionsContainer.appendChild(suggestion);
                searchBarContainer.appendChild(countryFlag);
            });
        });

        const margin = { top: 100, right: 300, bottom: 100, left: 50 }; // Adjust margin for table
        const width = window.innerWidth - margin.left - margin.right;
        const height = window.innerHeight - margin.top - margin.bottom;

        const svg = d3.select("#coincidenceTable")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const xScale = d3.scaleBand().range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "x-axis");

        svg.append("g")
            .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));

        svg.selectAll("line.horizontalGrid").data(yScale.ticks(10)).enter()
            .append("line")
            .attr("class", "horizontalGrid")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1);

function updateChart(selectedISO, attribute) {
    if (!selectedISO || !attribute) return; // Ensure both values are selected

    selectedAttribute = attribute;  // Ensure selectedAttribute is updated

    // Initialize weightMap to hold the coincidence values
    const weightMap = {};

    // Populate weightMap with coincidence values
    edgeListData.forEach(d => {
        if (d.source === selectedISO || d.target === selectedISO) {
            const otherCountry = d.source === selectedISO ? d.target : d.source;
            weightMap[otherCountry] = +d.weight;
        }
    });

    // Filter and prepare the data for the chart
    const filteredData = Object.keys(weightMap).map(countryISO => {
        const row = correlationMatrixData.find(d => d['ISO 3'] === countryISO);
        return {
            country: countryISO,
            coincidenceValue: row ? weightMap[countryISO] : 0,
            attributeValue: row ? +row[selectedAttribute] : 0,
        };
    });

    // Find the maximum attribute value for normalization
    const maxAttributeValue = d3.max(filteredData, d => d.attributeValue);

    // Normalize the attribute values
    filteredData.forEach(d => {
        d.normalizedAttributeValue = maxAttributeValue > 0 ? d.attributeValue / maxAttributeValue : 0;
    });

    filteredData.sort((a, b) => {
      const aValue = a.coincidenceValue;
      const bValue = b.coincidenceValue;

      // Check if either value is NaN
      if (isNaN(aValue)) return 1;  // Move a to the last place
      if (isNaN(bValue)) return -1; // Move b to the last place

      // Normal descending order comparison
      return bValue - aValue;
    });


    // Update scales
    xScale.domain(filteredData.map(d => d.country));

    // Update axes
    xAxis.call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -5)
        .attr("y", xScale.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .style("font-size", "10px");

    // Create or select the tooltip element using the specified CSS class
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltipCoincidenceTable coupontooltip")
        .style("position", "absolute")
        .style("z-index", 20)
        .style("pointer-events", "none")
        .style("visibility", "hidden");

    // Data binding and update for bars
    const bars = svg.selectAll(".bar").data(filteredData);
    const dots = svg.selectAll(".dot").data(filteredData);
    const regressionLine = svg.selectAll(".regression").data([filteredData]);

    bars.exit().remove();
    dots.exit().remove();
    regressionLine.exit().remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.normalizedAttributeValue))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.normalizedAttributeValue))
        .attr("fill", "orange")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("fill", "red")
                .transition()
                .duration(0)
                .attr("width", xScale.bandwidth() * 2)
                .attr("x", d => xScale(d.country) - (xScale.bandwidth() * 0.5)); // Adjusted to expand equally on both sides

            // Show the tooltip
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (event) {
            showTooltip(event);  // Call the showTooltip function
        })
        .on("mouseout", function () {
            // Reset the bar and hide the tooltip
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange")
                .attr("width", xScale.bandwidth())
                .attr("x", d => xScale(d.country));

            tooltip.style("visibility", "hidden");
        });

    dots.enter().append("circle")
        .attr("class", "dot")
        .merge(dots)
        .attr("cx", d => xScale(d.country) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.coincidenceValue))
        .attr("r", 3)
        .attr("fill", "steelblue")
        .raise();

    // Define a moving average function
    function movingAverage(data, windowSize) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - Math.floor(windowSize / 2));
            const end = Math.min(data.length - 1, i + Math.floor(windowSize / 2));
            const subset = data.slice(start, end + 1);
            const average = d3.mean(subset, d => d.y);
            result.push({ x: data[i].x, y: average });
        }
        return result;
    }

    // Set the moving average window size
    const windowSize = 30; // Adjust the window size for smoothing

    // Prepare data for regression line
    const regressionData = filteredData.map(d => ({
        x: xScale(d.country) + xScale.bandwidth() / 2,
        y: yScale(d.normalizedAttributeValue)
    }));

    // Apply moving average smoothing
    const smoothedData = movingAverage(regressionData, windowSize);

    // Define a spline curve
    const splineCurve = d3.line()
        .curve(d3.curveBasis) // Spline curve
        .x(d => d.x)
        .y(d => d.y);

    // Update regression line
    regressionLine.enter().append("path")
        .attr("class", "regression")
        .merge(regressionLine)
        .attr("d", splineCurve(smoothedData))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .raise();
}

function showTooltip(d) {
    var mouseX = d3.event.pageX;
    var mouseY = d3.event.pageY;

    // Assuming d.country contains the ISO code
    var countryISO = d.country;

    // Look up the country name and attribute value from the correlationMatrixData using the ISO code
    var countryData = correlationMatrixData.find(data => data['ISO 3'] === countryISO);
    var countryName = countryData ? countryData['Country Name'] : "Unknown Country";
    var attributeValue = countryData ? countryData[selectedAttribute] : "No Data";
    var iso2Code = countryData ? countryData['ISO 2'] : "Unknown";

    // Look up the selected country name
    var selectedCountryData = correlationMatrixData.find(data => data['ISO 3'] === selectedCountryISO);
    var selectedCountryName = selectedCountryData ? selectedCountryData['Country Name'] : "Selected Country";

    // Assuming there's a function to calculate or retrieve the coincidence value
    // between the selected country and the currently hovered country
    var coincidenceValue = parseFloat(edgeListData.find(edge =>
        (edge.source === selectedCountryISO && edge.target === countryISO) ||
        (edge.source === countryISO && edge.target === selectedCountryISO)
    ).weight).toFixed(5);

    // Format the tooltip content
    var tooltipContent = `
        <div style="display: flex; align-items: center;">
            <img src="static/country_flags/${iso2Code.toLowerCase()}.svg" 
                 alt="Flag of ${countryName}" 
                 style="border: 1px solid black; border-radius: 50%; width: 40px; height: 40px; margin-right: 10px;"/>
            <div>
                <strong>${countryName}</strong>
                <br><br>
                <div>${selectedAttribute}: ${attributeValue}</div>
                <div>Coincidence with ${selectedCountryName}: ${coincidenceValue}</div>
            </div>
        </div>
    `;

    var tooltip = d3.select(".tooltipCoincidenceTable");

    // Update tooltip content, position, visibility, and add shadow
    tooltip.html(tooltipContent)
        .style("left", (mouseX + 20) + "px")
        .style("top", (mouseY - 20) + "px")
        .style("visibility", "visible")
        .style("box-shadow", "8px 8px 8px rgba(0, 0, 0, 0.4)")  // Add shadow
        .style("border", "1px solid #ccc")  // Optional: add border for better separation
        .style("background-color", "white");  // Ensure solid background for the tooltip

    // Assuming you have a class or identifier for the elements representing countries
    d3.selectAll('.bar, .dot')  // Adjust based on your element classes
        .on('mousemove', showTooltip)
        .on("mouseout", function () {
            // Reset the bar and hide the tooltip
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange")
                .attr("width", xScale.bandwidth())
                .attr("x", d => xScale(d.country));

            tooltip.style("visibility", "hidden");
        });
}




        function displayR2(selectedISO, attribute) {
            // Check if country and attribute are selected
            if (!selectedISO || !attribute) {
                updateR2Box(NaN);
                return;
            }

            // Initialize weightMap to hold the coincidence values
            const weightMap = {};

            // Populate weightMap with coincidence values
            edgeListData.forEach(d => {
                if (d.source === selectedISO || d.target === selectedISO) {
                    const otherCountry = d.source === selectedISO ? d.target : d.source;
                    weightMap[otherCountry] = +d.weight;
                }
            });

            // Filter and prepare the data for R² calculation
            const filteredData = Object.keys(weightMap).map(countryISO => {
                const row = correlationMatrixData.find(d => d['ISO 3'] === countryISO);
                return {
                    coincidenceValue: weightMap[countryISO],
                    attributeValue: row ? +row[attribute] : NaN
                };
            }).filter(d => !isNaN(d.attributeValue) && !isNaN(d.coincidenceValue));


            // If not enough data for regression, skip R² calculation
            if (filteredData.length < 2) {
                updateR2Box(NaN);
                return;
            }

            const xValues = filteredData.map(d => d.attributeValue);
            const yValues = filteredData.map(d => d.coincidenceValue);

            // Calculate the R² value using simple-statistics' r-squared function
            const regressionLine = ss.linearRegressionLine(ss.linearRegression(filteredData.map(d => [d.attributeValue, d.coincidenceValue])));
            const r2Value = ss.rSquared(filteredData.map(d => [d.attributeValue, d.coincidenceValue]), regressionLine);


            // Update R² display
            updateR2Box(r2Value);
        }

        function displaySpearman(selectedISO, attribute) {
            // Check if country and attribute are selected
            if (!selectedISO || !attribute) {
                updateSpearmanBox(NaN);
                return;
            }

            // Initialize weightMap to hold the coincidence values
            const weightMap = {};

            // Populate weightMap with coincidence values
            edgeListData.forEach(d => {
                if (d.source === selectedISO || d.target === selectedISO) {
                    const otherCountry = d.source === selectedISO ? d.target : d.source;
                    weightMap[otherCountry] = +d.weight;
                }
            });

            // Filter and prepare the data for Spearman's rank correlation calculation
            const filteredData = Object.keys(weightMap).map(countryISO => {
                const row = correlationMatrixData.find(d => d['ISO 3'] === countryISO);
                return {
                    coincidenceValue: weightMap[countryISO],
                    attributeValue: row ? +row[attribute] : NaN
                };
            }).filter(d => !isNaN(d.attributeValue) && !isNaN(d.coincidenceValue));

            // Debugging: log filtered data
            console.log("Filtered Data:", filteredData);

            // If not enough data for correlation calculation, skip
            if (filteredData.length < 2) {
                updateSpearmanBox(NaN);
                return;
            }

            const xValues = filteredData.map(d => d.attributeValue);
            const yValues = filteredData.map(d => d.coincidenceValue);

            // Function to compute ranks of an array
            function rankArray(arr) {
                const sorted = arr.slice().sort((a, b) => a - b);
                return arr.map(v => sorted.indexOf(v) + 1);
            }

            // Calculate ranks for both xValues and yValues
            const xRanks = rankArray(xValues);
            const yRanks = rankArray(yValues);

            // Calculate Spearman's rank correlation coefficient
            const n = xRanks.length;
            const dSquaredSum = xRanks.reduce((sum, rank, i) => sum + Math.pow(rank - yRanks[i], 2), 0);
            const spearmanCorrelation = 1 - (6 * dSquaredSum) / (n * (n * n - 1));

            // Update the display with the Spearman's rank correlation value
            updateSpearmanBox(spearmanCorrelation);
        }



        function updateR2Box(r2Value) {
            d3.select("#r2Box").remove();  // Remove existing R² box

            d3.select("#coincidenceTable")
                .append("div")
                .attr("id", "r2Box")
                .style("position", "absolute")
                .style("bottom", "10px")
                .style("left", "10px")
                .style("background-color", "#f9f9f9")
                .style("border", "1px solid #ccc")
                .style("padding", "10px")
                .style("font-size", "12px")
                .style("color", "black")
                .text(`R²: ${isNaN(r2Value) ? "N/A" : r2Value.toFixed(2)}`);
        }

        function updateSpearmanBox(spearmanValue) {
            d3.select("#spearmanBox").remove();  // Remove existing Spearman box

            d3.select("#coincidenceTable")
                .append("div")
                .attr("id", "spearmanBox")
                .style("position", "absolute")
                .style("bottom", "10px")
                .style("left", "100px")
                .style("background-color", "#f9f9f9")
                .style("border", "1px solid #ccc")
                .style("padding", "10px")
                .style("font-size", "12px")
                .style("color", "black")
                .text(`Spearman: ${isNaN(spearmanValue) ? "N/A" : spearmanValue.toFixed(2)}`);
        }



        // Create a table for the correlation matrix attributes
        const tableContainer = d3.select("#coincidenceTable").append("div")
            .attr("id", "tableContainer")
            .style("position", "absolute")
            .style("top", margin.top + "px")
            .style("right", "20px")
            .style("width", "250px")
            .style("overflow-y", "auto")
            .style("visibility", "visible") // Ensure visibility
            .style("background-color", "rgba(255, 255, 255, 0.8)") // Match tooltip background color
            .style("border", "1px solid #ddd") // Match tooltip border
            .style("border-radius", "5px") // Match tooltip border radius
            .style("padding", "10px") // Match tooltip padding
            .style("text-align", "left")
            .style("font-family", '"Lucida Console", Monaco, monospace'); // Match tooltip font

        const table = d3.select("#tableContainer").append("table")
            .style("width", "100%")
            .style("border-collapse", "collapse");

        // Create table header
        const thead = table.append("thead").append("tr");
        thead.append("th")
            .text("Country Metrics")
            .style("border-bottom", "1px solid #ccc")
            .style("padding", "10px 0") // Padding above and below the text


        // Create table body
        const tbody = table.append("tbody");
        const attributes = Object.keys(correlationMatrixData[0]).filter(d => d !== 'Country Name' && d !== 'ISO 3' && d !== 'ISO 2');
        var tooltip = d3.select(".tooltipCoincidenceTable");

        attributes.forEach(attr => {
            tbody.append("tr")
                .on("click", function() {
                    // Reset the background color for all rows
                    tbody.selectAll("tr").style("background-color", null);

                    // Highlight the clicked row
                    d3.select(this).style("background-color", "grey");


                    // Update the selected attribute
                    selectedAttribute = attr;

                    // Update charts and displays if a country is selected
                    if (selectedCountryISO) {
                        updateChart(selectedCountryISO, selectedAttribute);
                        displayR2(selectedCountryISO, selectedAttribute);
                        displaySpearman(selectedCountryISO, selectedAttribute);
                    }
                })
                .on("mouseover", function (){
                    d3.select(this).style("color", "orange");
                })
                .on("mouseout", function () {
                    d3.select(this).style("color", "black");
                    tooltip.style("visibility", "hidden");
                })
                .append("td")
                .text(attr)
                .style("cursor", "pointer");
        });



        // Initialize with default values
        updateChart('CHN', 'Freedom House Index');
        displayR2('CHN', 'Freedom House Index');
        displaySpearman('CHN', 'Freedom House Index');

    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

window.addEventListener('globalVotingSimilarityReady', (event) => {
    const data = event.detail.data;
    createCoincidenceTableWithDots(data);
});
