function initializeNetworkGraph(data) {

    const nodes = [
        {id: 0, code: "AFG", name: "Afghanistan", flag: "static/country_flags/af.svg"},
        {id: 1, code: "AGO", name: "Angola", flag: "static/country_flags/ao.svg"},
        {id: 2, code: "ALB", name: "Albania", flag: "static/country_flags/al.svg"},
        {id: 3, code: "AND", name: "Andorra", flag: "static/country_flags/ad.svg"},
        {id: 4, code: "ARE", name: "United Arab Emirates", flag: "static/country_flags/ae.svg"},
        {id: 5, code: "ARG", name: "Argentina", flag: "static/country_flags/ar.svg"},
        {id: 6, code: "ARM", name: "Armenia", flag: "static/country_flags/am.svg"},
        {id: 7, code: "ATG", name: "Antigua and Barbuda", flag: "static/country_flags/ag.svg"},
        {id: 8, code: "AUS", name: "Australia", flag: "static/country_flags/au.svg"},
        {id: 9, code: "AUT", name: "Austria", flag: "static/country_flags/at.svg"},
        {id: 10, code: "AZE", name: "Azerbaijan", flag: "static/country_flags/az.svg"},
        {id: 11, code: "BDI", name: "Burundi", flag: "static/country_flags/bi.svg"},
        {id: 12, code: "BEL", name: "Belgium", flag: "static/country_flags/be.svg"},
        {id: 13, code: "BEN", name: "Benin", flag: "static/country_flags/bj.svg"},
        {id: 14, code: "BFA", name: "Burkina Faso", flag: "static/country_flags/bf.svg"},
        {id: 15, code: "BGD", name: "Bangladesh", flag: "static/country_flags/bd.svg"},
        {id: 16, code: "BGR", name: "Bulgaria", flag: "static/country_flags/bg.svg"},
        {id: 17, code: "BHR", name: "Bahrain", flag: "static/country_flags/bh.svg"},
        {id: 18, code: "BHS", name: "Bahamas", flag: "static/country_flags/bs.svg"},
        {id: 19, code: "BIH", name: "Bosnia and Herzegovina", flag: "static/country_flags/ba.svg"},
        {id: 20, code: "BLR", name: "Belarus", flag: "static/country_flags/by.svg"},
        {id: 21, code: "BLZ", name: "Belize", flag: "static/country_flags/bz.svg"},
        {id: 22, code: "BOL", name: "Bolivia", flag: "static/country_flags/bo.svg"},
        {id: 23, code: "BRA", name: "Brazil", flag: "static/country_flags/br.svg"},
        {id: 24, code: "BRB", name: "Barbados", flag: "static/country_flags/bb.svg"},
        {id: 25, code: "BRN", name: "Brunei", flag: "static/country_flags/bn.svg"},
        {id: 26, code: "BTN", name: "Bhutan", flag: "static/country_flags/bt.svg"},
        {id: 27, code: "BWA", name: "Botswana", flag: "static/country_flags/bw.svg"},
        {id: 28, code: "CAF", name: "Central African Republic", flag: "static/country_flags/cf.svg"},
        {id: 29, code: "CAN", name: "Canada", flag: "static/country_flags/ca.svg"},
        {id: 30, code: "CHE", name: "Switzerland", flag: "static/country_flags/ch.svg"},
        {id: 31, code: "CHL", name: "Chile", flag: "static/country_flags/cl.svg"},
        {id: 32, code: "CHN", name: "China", flag: "static/country_flags/cn.svg"},
        {id: 33, code: "CIV", name: "Ivory Coast", flag: "static/country_flags/ci.svg"},
        {id: 34, code: "CMR", name: "Cameroon", flag: "static/country_flags/cm.svg"},
        {id: 35, code: "COD", name: "Democratic Republic of the Congo", flag: "static/country_flags/cd.svg"},
        {id: 36, code: "COG", name: "Republic of the Congo", flag: "static/country_flags/cg.svg"},
        {id: 37, code: "COL", name: "Colombia", flag: "static/country_flags/co.svg"},
        {id: 38, code: "COM", name: "Comoros", flag: "static/country_flags/km.svg"},
        {id: 39, code: "CPV", name: "Cape Verde", flag: "static/country_flags/cv.svg"},
        {id: 40, code: "CRI", name: "Costa Rica", flag: "static/country_flags/cr.svg"},
        {id: 41, code: "CUB", name: "Cuba", flag: "static/country_flags/cu.svg"},
        {id: 42, code: "CYP", name: "Cyprus", flag: "static/country_flags/cy.svg"},
        {id: 43, code: "CZE", name: "Czech Republic", flag: "static/country_flags/cz.svg"},
        {id: 44, code: "DEU", name: "Germany", flag: "static/country_flags/de.svg"},
        {id: 45, code: "DJI", name: "Djibouti", flag: "static/country_flags/dj.svg"},
        {id: 46, code: "DMA", name: "Dominica", flag: "static/country_flags/dm.svg"},
        {id: 47, code: "DNK", name: "Denmark", flag: "static/country_flags/dk.svg"},
        {id: 48, code: "DOM", name: "Dominican Republic", flag: "static/country_flags/do.svg"},
        {id: 49, code: "DZA", name: "Algeria", flag: "static/country_flags/dz.svg"},
        {id: 50, code: "ECU", name: "Ecuador", flag: "static/country_flags/ec.svg"},
        {id: 51, code: "EGY", name: "Egypt", flag: "static/country_flags/eg.svg"},
        {id: 52, code: "ERI", name: "Eritrea", flag: "static/country_flags/er.svg"},
        {id: 53, code: "ESP", name: "Spain", flag: "static/country_flags/es.svg"},
        {id: 54, code: "EST", name: "Estonia", flag: "static/country_flags/ee.svg"},
        {id: 55, code: "ETH", name: "Ethiopia", flag: "static/country_flags/et.svg"},
        {id: 56, code: "FIN", name: "Finland", flag: "static/country_flags/fi.svg"},
        {id: 57, code: "FJI", name: "Fiji", flag: "static/country_flags/fj.svg"},
        {id: 58, code: "FRA", name: "France", flag: "static/country_flags/fr.svg"},
        {id: 59, code: "FSM", name: "Micronesia", flag: "static/country_flags/fm.svg"},
        {id: 60, code: "GAB", name: "Gabon", flag: "static/country_flags/ga.svg"},
        {id: 61, code: "GBR", name: "United Kingdom", flag: "static/country_flags/gb.svg"},
        {id: 62, code: "GEO", name: "Georgia", flag: "static/country_flags/ge.svg"},
        {id: 63, code: "GHA", name: "Ghana", flag: "static/country_flags/gh.svg"},
        {id: 64, code: "GIN", name: "Guinea", flag: "static/country_flags/gn.svg"},
        {id: 65, code: "GMB", name: "Gambia", flag: "static/country_flags/gm.svg"},
        {id: 66, code: "GNB", name: "Guinea-Bissau", flag: "static/country_flags/gw.svg"},
        {id: 67, code: "GNQ", name: "Equatorial Guinea", flag: "static/country_flags/gq.svg"},
        {id: 68, code: "GRC", name: "Greece", flag: "static/country_flags/gr.svg"},
        {id: 69, code: "GRD", name: "Grenada", flag: "static/country_flags/gd.svg"},
        {id: 70, code: "GTM", name: "Guatemala", flag: "static/country_flags/gt.svg"},
        {id: 71, code: "GUY", name: "Guyana", flag: "static/country_flags/gy.svg"},
        {id: 72, code: "HND", name: "Honduras", flag: "static/country_flags/hn.svg"},
        {id: 73, code: "HRV", name: "Croatia", flag: "static/country_flags/hr.svg"},
        {id: 74, code: "HTI", name: "Haiti", flag: "static/country_flags/ht.svg"},
        {id: 75, code: "HUN", name: "Hungary", flag: "static/country_flags/hu.svg"},
        {id: 76, code: "IDN", name: "Indonesia", flag: "static/country_flags/id.svg"},
        {id: 77, code: "IND", name: "India", flag: "static/country_flags/in.svg"},
        {id: 78, code: "IRL", name: "Ireland", flag: "static/country_flags/ie.svg"},
        {id: 79, code: "IRN", name: "Iran", flag: "static/country_flags/ir.svg"},
        {id: 80, code: "IRQ", name: "Iraq", flag: "static/country_flags/iq.svg"},
        {id: 81, code: "ISL", name: "Iceland", flag: "static/country_flags/is.svg"},
        {id: 82, code: "ISR", name: "Israel", flag: "static/country_flags/il.svg"},
        {id: 83, code: "ITA", name: "Italy", flag: "static/country_flags/it.svg"},
        {id: 84, code: "JAM", name: "Jamaica", flag: "static/country_flags/jm.svg"},
        {id: 85, code: "JOR", name: "Jordan", flag: "static/country_flags/jo.svg"},
        {id: 86, code: "JPN", name: "Japan", flag: "static/country_flags/jp.svg"},
        {id: 87, code: "KAZ", name: "Kazakhstan", flag: "static/country_flags/kz.svg"},
        {id: 88, code: "KEN", name: "Kenya", flag: "static/country_flags/ke.svg"},
        {id: 89, code: "KGZ", name: "Kyrgyzstan", flag: "static/country_flags/kg.svg"},
        {id: 90, code: "KHM", name: "Cambodia", flag: "static/country_flags/kh.svg"},
        {id: 91, code: "KIR", name: "Kiribati", flag: "static/country_flags/ki.svg"},
        {id: 92, code: "KNA", name: "Saint Kitts and Nevis", flag: "static/country_flags/kn.svg"},
        {id: 93, code: "KOR", name: "South Korea", flag: "static/country_flags/kr.svg"},
        {id: 94, code: "KWT", name: "Kuwait", flag: "static/country_flags/kw.svg"},
        {id: 95, code: "LAO", name: "Laos", flag: "static/country_flags/la.svg"},
        {id: 96, code: "LBN", name: "Lebanon", flag: "static/country_flags/lb.svg"},
        {id: 97, code: "LBR", name: "Liberia", flag: "static/country_flags/lr.svg"},
        {id: 98, code: "LBY", name: "Libya", flag: "static/country_flags/ly.svg"},
        {id: 99, code: "LCA", name: "Saint Lucia", flag: "static/country_flags/lc.svg"},
        {id: 100, code: "LIE", name: "Liechtenstein", flag: "static/country_flags/li.svg"},
        {id: 101, code: "LKA", name: "Sri Lanka", flag: "static/country_flags/lk.svg"},
        {id: 102, code: "LSO", name: "Lesotho", flag: "static/country_flags/ls.svg"},
        {id: 103, code: "LTU", name: "Lithuania", flag: "static/country_flags/lt.svg"},
        {id: 104, code: "LUX", name: "Luxembourg", flag: "static/country_flags/lu.svg"},
        {id: 105, code: "LVA", name: "Latvia", flag: "static/country_flags/lv.svg"},
        {id: 106, code: "MAR", name: "Morocco", flag: "static/country_flags/ma.svg"},
        {id: 107, code: "MCO", name: "Monaco", flag: "static/country_flags/mc.svg"},
        {id: 108, code: "MDA", name: "Moldova", flag: "static/country_flags/md.svg"},
        {id: 109, code: "MDG", name: "Madagascar", flag: "static/country_flags/mg.svg"},
        {id: 110, code: "MDV", name: "Maldives", flag: "static/country_flags/mv.svg"},
        {id: 111, code: "MEX", name: "Mexico", flag: "static/country_flags/mx.svg"},
        {id: 112, code: "MHL", name: "Marshall Islands", flag: "static/country_flags/mh.svg"},
        {id: 113, code: "MKD", name: "North Macedonia", flag: "static/country_flags/mk.svg"},
        {id: 114, code: "MLI", name: "Mali", flag: "static/country_flags/ml.svg"},
        {id: 115, code: "MLT", name: "Malta", flag: "static/country_flags/mt.svg"},
        {id: 116, code: "MMR", name: "Myanmar", flag: "static/country_flags/mm.svg"},
        {id: 117, code: "MNE", name: "Montenegro", flag: "static/country_flags/me.svg"},
        {id: 118, code: "MNG", name: "Mongolia", flag: "static/country_flags/mn.svg"},
        {id: 119, code: "MOZ", name: "Mozambique", flag: "static/country_flags/mz.svg"},
        {id: 120, code: "MRT", name: "Mauritania", flag: "static/country_flags/mr.svg"},
        {id: 121, code: "MUS", name: "Mauritius", flag: "static/country_flags/mu.svg"},
        {id: 122, code: "MWI", name: "Malawi", flag: "static/country_flags/mw.svg"},
        {id: 123, code: "MYS", name: "Malaysia", flag: "static/country_flags/my.svg"},
        {id: 124, code: "NAM", name: "Namibia", flag: "static/country_flags/na.svg"},
        {id: 125, code: "NER", name: "Niger", flag: "static/country_flags/ne.svg"},
        {id: 126, code: "NGA", name: "Nigeria", flag: "static/country_flags/ng.svg"},
        {id: 127, code: "NIC", name: "Nicaragua", flag: "static/country_flags/ni.svg"},
        {id: 128, code: "NLD", name: "Netherlands", flag: "static/country_flags/nl.svg"},
        {id: 129, code: "NOR", name: "Norway", flag: "static/country_flags/no.svg"},
        {id: 130, code: "NPL", name: "Nepal", flag: "static/country_flags/np.svg"},
        {id: 131, code: "NRU", name: "Nauru", flag: "static/country_flags/nr.svg"},
        {id: 132, code: "NZL", name: "New Zealand", flag: "static/country_flags/nz.svg"},
        {id: 133, code: "OMN", name: "Oman", flag: "static/country_flags/om.svg"},
        {id: 134, code: "PAK", name: "Pakistan", flag: "static/country_flags/pk.svg"},
        {id: 135, code: "PAN", name: "Panama", flag: "static/country_flags/pa.svg"},
        {id: 136, code: "PER", name: "Peru", flag: "static/country_flags/pe.svg"},
        {id: 137, code: "PHL", name: "Philippines", flag: "static/country_flags/ph.svg"},
        {id: 138, code: "PLW", name: "Palau", flag: "static/country_flags/pw.svg"},
        {id: 139, code: "PNG", name: "Papua New Guinea", flag: "static/country_flags/pg.svg"},
        {id: 140, code: "POL", name: "Poland", flag: "static/country_flags/pl.svg"},
        {id: 141, code: "PRK", name: "North Korea", flag: "static/country_flags/kp.svg"},
        {id: 142, code: "PRT", name: "Portugal", flag: "static/country_flags/pt.svg"},
        {id: 143, code: "PRY", name: "Paraguay", flag: "static/country_flags/py.svg"},
        {id: 144, code: "QAT", name: "Qatar", flag: "static/country_flags/qa.svg"},
        {id: 145, code: "ROU", name: "Romania", flag: "static/country_flags/ro.svg"},
        {id: 146, code: "RUS", name: "Russia", flag: "static/country_flags/ru.svg"},
        {id: 147, code: "RWA", name: "Rwanda", flag: "static/country_flags/rw.svg"},
        {id: 148, code: "SAU", name: "Saudi Arabia", flag: "static/country_flags/sa.svg"},
        {id: 149, code: "SDN", name: "Sudan", flag: "static/country_flags/sd.svg"},
        {id: 150, code: "SEN", name: "Senegal", flag: "static/country_flags/sn.svg"},
        {id: 151, code: "SGP", name: "Singapore", flag: "static/country_flags/sg.svg"},
        {id: 152, code: "SLB", name: "Solomon Islands", flag: "static/country_flags/sb.svg"},
        {id: 153, code: "SLE", name: "Sierra Leone", flag: "static/country_flags/sl.svg"},
        {id: 154, code: "SLV", name: "El Salvador", flag: "static/country_flags/sv.svg"},
        {id: 155, code: "SMR", name: "San Marino", flag: "static/country_flags/sm.svg"},
        {id: 156, code: "SOM", name: "Somalia", flag: "static/country_flags/so.svg"},
        {id: 157, code: "SRB", name: "Serbia", flag: "static/country_flags/rs.svg"},
        {id: 158, code: "SSD", name: "South Sudan", flag: "static/country_flags/ss.svg"},
        {id: 159, code: "STP", name: "São Tomé and Príncipe", flag: "static/country_flags/st.svg"},
        {id: 160, code: "SUR", name: "Suriname", flag: "static/country_flags/sr.svg"},
        {id: 161, code: "SVK", name: "Slovakia", flag: "static/country_flags/sk.svg"},
        {id: 162, code: "SVN", name: "Slovenia", flag: "static/country_flags/si.svg"},
        {id: 163, code: "SWE", name: "Sweden", flag: "static/country_flags/se.svg"},
        {id: 164, code: "SWZ", name: "Eswatini", flag: "static/country_flags/sz.svg"},
        {id: 165, code: "SYC", name: "Seychelles", flag: "static/country_flags/sc.svg"},
        {id: 166, code: "SYR", name: "Syria", flag: "static/country_flags/sy.svg"},
        {id: 167, code: "TCD", name: "Chad", flag: "static/country_flags/td.svg"},
        {id: 168, code: "TGO", name: "Togo", flag: "static/country_flags/tg.svg"},
        {id: 169, code: "THA", name: "Thailand", flag: "static/country_flags/th.svg"},
        {id: 170, code: "TJK", name: "Tajikistan", flag: "static/country_flags/tj.svg"},
        {id: 171, code: "TKM", name: "Turkmenistan", flag: "static/country_flags/tm.svg"},
        {id: 172, code: "TLS", name: "Timor-Leste", flag: "static/country_flags/tl.svg"},
        {id: 173, code: "TON", name: "Tonga", flag: "static/country_flags/to.svg"},
        {id: 174, code: "TTO", name: "Trinidad and Tobago", flag: "static/country_flags/tt.svg"},
        {id: 175, code: "TUN", name: "Tunisia", flag: "static/country_flags/tn.svg"},
        {id: 176, code: "TUR", name: "Turkey", flag: "static/country_flags/tr.svg"},
        {id: 177, code: "TUV", name: "Tuvalu", flag: "static/country_flags/tv.svg"},
        {id: 178, code: "TZA", name: "Tanzania", flag: "static/country_flags/tz.svg"},
        {id: 179, code: "UGA", name: "Uganda", flag: "static/country_flags/ug.svg"},
        {id: 180, code: "UKR", name: "Ukraine", flag: "static/country_flags/ua.svg"},
        {id: 181, code: "URY", name: "Uruguay", flag: "static/country_flags/uy.svg"},
        {id: 182, code: "USA", name: "United States", flag: "static/country_flags/us.svg"},
        {id: 183, code: "UZB", name: "Uzbekistan", flag: "static/country_flags/uz.svg"},
        {id: 184, code: "VCT", name: "Saint Vincent and the Grenadines", flag: "static/country_flags/vc.svg"},
        {id: 185, code: "VEN", name: "Venezuela", flag: "static/country_flags/ve.svg"},
        {id: 186, code: "VNM", name: "Vietnam", flag: "static/country_flags/vn.svg"},
        {id: 187, code: "VUT", name: "Vanuatu", flag: "static/country_flags/vu.svg"},
        {id: 188, code: "WSM", name: "Samoa", flag: "static/country_flags/ws.svg"},
        {id: 189, code: "YEM", name: "Yemen", flag: "static/country_flags/ye.svg"},
        {id: 190, code: "ZAF", name: "South Africa", flag: "static/country_flags/za.svg"},
        {id: 191, code: "ZMB", name: "Zambia", flag: "static/country_flags/zm.svg"},
        {id: 192, code: "ZWE", name: "Zimbabwe", flag: "static/country_flags/zw.svg"},
        {id: 193, code: "YUG", name: "Yugoslavia", flag: "static/country_flags/rs.svg"},
        {id: 194, code: "TWN", name: "Chinese Taipei", flag: "static/country_flags/tw.svg"}
    ];

    // Create a map to convert country codes to node IDs
    const codeToId = {};
    nodes.forEach(node => {
        codeToId[node.code] = node.id;
    });

    let simulation, link, node;
    let edgeWeightThreshold = 0.90;
    let originalLinks = [];

    function loadEdges(loadEdgesData) {
        if (!loadEdgesData) {
            console.error("Data is undefined or null:", loadEdgesData);
            return;
        }

        // Parse the global data into an array of link objects
        originalLinks = loadEdgesData.map(d => ({
            source: codeToId[d.source],
            target: codeToId[d.target],
            weight: +d.weight
        }));

        initializeSimulation(nodes, originalLinks);
    }

    function initializeNodePositions(nodes, padding = 50) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        nodes.forEach(d => {
            d.x = padding + Math.random() * (width - 2 * padding);
            d.y = padding + Math.random() * (height - 2 * padding);
        });
    }

    const tooltipNetworkGraph = d3.select(".tooltipNetworkGraph");

    tooltipNetworkGraph
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("visibility", "hidden");

    // Function to show the tooltip
    function showTooltip(event, d) {
        const mouseX = event.pageX;
        const mouseY = event.pageY;

        const tooltipContent = `
            <div style="display: flex; align-items: center;">
                <img src="${d.flag}" 
                     alt="Flag of ${d.name}" 
                     style="border: 1px solid black; border-radius: 50%; width: 40px; height: 40px; margin-right: 10px;"/>
                <div>
                    <strong>${d.name}</strong>
                </div>
            </div>
        `;

        tooltipNetworkGraph
            .html('hello')
            .style("left", (mouseX + 20) + "px")
            .style("top", (mouseY - 20) + "px")
            .style("visibility", "hidden")
            .style("box-shadow", "8px 8px 8px rgba(0, 0, 0, 0.4)")
            .style("border", "1px solid #ccc")
            .style("background-color", "white");
    }

    function hideTooltip() {
        tooltipNetworkGraph.style("visibility", "hidden");
    }

    function initializeSimulation(nodes, links) {
        const width = window.innerWidth, height = window.innerHeight;

        initializeNodePositions(nodes, width * 2, height * 2);

        const svg = d3.select("#networkGraph svg")
            .attr("width", width)
            .attr("height", height);

        const container = svg.append("g").attr("class", "container");

        const zoom = d3.zoom()
            .scaleExtent([0.1, 500])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(zoom)
            .call(zoom.transform, d3.zoomIdentity.scale(0.1).translate(width * 5, height * 5));

        function zoomed() {
            container.attr("transform", d3.event.transform);
        }

        const filteredLinks = links.filter(link => link.weight >= edgeWeightThreshold);
        const colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["black", "purple", "orange"]))
            .domain([0, d3.max(filteredLinks, d => d.weight)]);

        simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(filteredLinks).id(d => d.id).strength(d => d.weight * 0.1))
            .force("charge", d3.forceManyBody().strength(-2000))
            .force("center", d3.forceCenter(0, 0))
            .on("tick", ticked);

        link = container.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(filteredLinks)
            .enter().append("line")
            .attr("stroke", d => colorScale(d.weight))
            .attr("stroke-width", "1px");

        node = container.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .on("mouseover", showTooltip)
            .on("mousemove", function (event) {
                d3.select(".tooltipNetworkGraph")
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", hideTooltip);

        node.append("circle")
            .attr("r", 15)
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        node.append("image")
            .attr("xlink:href", d => d.flag)
            .attr("x", -15)
            .attr("y", -15)
            .attr("width", 30)
            .attr("height", 30);

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        }
    }

    function updateGraphWithParameters() {
        const filteredLinks = originalLinks.filter(link => link.weight >= edgeWeightThreshold);

        const colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["black", "purple", "orange"]))
            .domain([0, d3.max(filteredLinks, d => d.weight)]);

        link = link.data(filteredLinks, d => `${d.source.id}-${d.target.id}`);
        link.exit().remove();
        link = link.enter().append("line")
            .attr("class", "link")
            .attr("stroke", d => colorScale(d.weight))
            .attr("stroke-width", "1px")
            .merge(link);

        simulation.force("link").links(filteredLinks);
        simulation.alpha(1).restart();
    }

    d3.select("#edgeWeightSlider").on("input", function () {
        edgeWeightThreshold = +this.value;
        d3.select("#edgeWeightValue").text(edgeWeightThreshold.toFixed(2));
        updateGraphWithParameters();
    });

    function showNetworkGraph() {
        if (!simulation) {
            loadEdges(data);
        } else {
            simulation.restart();
        }
    }

    function stopNetworkGraph() {
        if (simulation) {
            simulation.stop();
        }
    }

    document.getElementById("networkGraphBtn").addEventListener("click", showNetworkGraph);
    document.getElementById("worldMapBtn").addEventListener("click", stopNetworkGraph);
    document.getElementById("coincidenceTableBtn").addEventListener("click", stopNetworkGraph);

    d3.select("#edgeWeightSlider").property("value", edgeWeightThreshold);
    d3.select("#edgeWeightValue").text(edgeWeightThreshold.toFixed(2));
}

window.addEventListener('globalVotingSimilarityReady', (event) => {
    const data = event.detail.data;
    initializeNetworkGraph(data);
});