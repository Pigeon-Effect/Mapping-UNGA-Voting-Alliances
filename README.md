# **Mapping UNGA Voting Alliances**

**Explore the interactive tool here:**  
🌐 [https://pigeon-effect.github.io/Mapping-UNGA-Voting-Alliances/](https://pigeon-effect.github.io/Mapping-UNGA-Voting-Alliances/)

This project analyzes alliance structures in the United Nations General Assembly (UNGA) based on voting coincidences between 1946 and 2024. The interactive dashboard allows users to examine geopolitical clusters and bilateral alignments from the perspective of any member state.

By computing custom co-voting similarity indices the project aims to uncover deeper structures of international alignment beyond surface-level bloc affiliations.


---

## **Key Features and Methodology**

### 🎛️ **Interactive Filtering Tool**

As voting similarity depends strongly on context and agenda, we introduce a filtering tool that allows users to customize the analysis along three axes:

1. **Time Range**: Choose resolutions from any year span between 1970 and 2022.
2. **Issue Categories**: Six categories (e.g. human rights, arms control, colonialism) can be selected in any combination.
3. **Perspective**: Select any country to calculate similarity from its standpoint.

The tool is implemented in **Dash** and visualized with **Plotly**.

---

### 🔧 **Data Cleaning**

The dataset required several preprocessing steps to handle:
- Historical name changes (e.g., Yugoslavia, Sudan/South Sudan)
- Minor inconsistencies and missing values
- Harmonization of ISO country codes

The cleaned dataset and code used for preprocessing are included in this repository.

---

### 📈 **Similarity Calculation**

The similarity between two countries is computed per resolution using a scoring system:

- **1.0** → (YES & YES) or (NO & NO)  
- **0.5** → (YES & ABSTENTION) or (NO & ABSTENTION)  
- **0.0** → (YES & NO) or (NO & YES)

These values are summed over all shared votes and normalized by the number of co-voted resolutions. The function is modular and can be easily adjusted for alternative definitions.

---


## **Visual Results**

### 📌 Landing Page
A screenshot of the interactive dashboard entry point.

![Landing Page](Results/Website/Landing%20Page.png)

---

### 🗺️ World Map of Voting Clusters
A choropleth map showing UN members colored by their voting alignment cluster.

![World Map](Results/Website/World%20Map.png)

---

### 🧮 Coincidence Table
A matrix showing average similarity between clusters.

![Coincidence Table](Results/Website/Coincidence%20Table.png)

---

### 🔗 Network Graph of Alliances
A Gephi-rendered network graph of bilateral voting similarities.

![Network Graph](Results/Website/Network%20Graph.png)

