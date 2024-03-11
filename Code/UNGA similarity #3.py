import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objs as go
import dash
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output, State

# Read the CSV file
df = pd.read_csv("cleanedUNGAVotes.csv")
df['year'] = df['date'].apply(lambda x: int(x[:4]))


# Define a function to calculate similarity
def calculate_similarity(vote1, vote2):
    if vote1 == vote2:
        return 1
    elif vote1 == 2 or vote2 == 2:
        return 0.5
    else:
        return 0

def similarity_by_country(df, country_short, start_date, end_date, subjects):
    if subjects == ['all']:
        df = df[(df["year"] >= start_date) & (df["year"] <= end_date)]
    else:
        df = df[(df[subjects].any(axis=1)) & (df["year"] >= start_date) & (df["year"] <= end_date)]

    n_resID = len(df["resid"].unique())
    n_countries = len(df["Country"].unique())

    similarity_list = np.zeros((n_countries))

    # list of all coutries
    countries = df['Country'].unique().tolist()

    # save resolution per country with activate votes
    res_per_country = pd.DataFrame(data={"Country": countries, "res_count": 0})

    for k in range(n_resID):
        # check if country1 is in the dataframe in this resolution
        if len(df[(df["resid"] == df["resid"].unique()[k]) & (df["Country"] == country_short)]) == 0:
            continue
        for i in range(n_countries):
            # check if country1 is in the dataframe in this resolution
            if len(df[(df["resid"] == df["resid"].unique()[k]) & (df["Country"] == res_per_country.iloc[i]["Country"])]) == 0:
                continue

            vote1 = df[(df["resid"] == df["resid"].unique()[k]) & (df["Country"] == country_short)]["vote"].values[0] # Fetch vote for the current resID
            vote2 = df[(df["resid"] == df["resid"].unique()[k]) & (df["Country"] == res_per_country.iloc[i]["Country"])]["vote"].values[0]

            # skip calculation if at least one vote is absent(8) or not a member(9)
            if (vote1 == 8) | (vote1 == 9) | (vote2 == 8) | (vote2 == 9):
                continue
            else:
                # calcalute similarity between vote1 and vote2
                similarity_list[i] += calculate_similarity(vote1, vote2)
                res_per_country.at[i, "res_count"] += 1

    # include number of resolutions in calculation
    for i in range(n_countries):
        similarity_list[i] /= res_per_country.iloc[i]["res_count"]

    # transform the similarity_list into a dataframe and take the short country names as index
    similarity_df = pd.DataFrame(similarity_list, index=countries, columns=[country_short])

    return similarity_df

# Initialize Dash app
app = dash.Dash(__name__)

# Dictionary mapping ISO-3 country codes to their real names
iso3_to_country = {
    "AFG": "Afghanistan",
    "ALB": "Albania",
    "DZA": "Algeria",
    "AND": "Andorra",
    "AGO": "Angola",
    "ATG": "Antigua and Barbuda",
    "ARG": "Argentina",
    "ARM": "Armenia",
    "AUS": "Australia",
    "AUT": "Austria",
    "AZE": "Azerbaijan",
    "BHS": "Bahamas",
    "BHR": "Bahrain",
    "BGD": "Bangladesh",
    "BRB": "Barbados",
    "BLR": "Belarus",
    "BEL": "Belgium",
    "BLZ": "Belize",
    "BEN": "Benin",
    "BTN": "Bhutan",
    "BOL": "Bolivia",
    "BIH": "Bosnia and Herzegovina",
    "BWA": "Botswana",
    "BRA": "Brazil",
    "BRN": "Brunei Darussalam",
    "BGR": "Bulgaria",
    "BFA": "Burkina Faso",
    "BDI": "Burundi",
    "CPV": "Cabo Verde",
    "KHM": "Cambodia",
    "CMR": "Cameroon",
    "CAN": "Canada",
    "CAF": "Central African Republic",
    "TCD": "Chad",
    "CHL": "Chile",
    "CHN": "China",
    "COL": "Colombia",
    "COM": "Comoros",
    "COG": "Congo",
    "CRI": "Costa Rica",
    "CIV": "Cote d'Ivoire",
    "HRV": "Croatia",
    "CUB": "Cuba",
    "CYP": "Cyprus",
    "CZE": "Czech Republic",
    "PRK": "Democratic People's Republic of Korea",
    "COD": "Democratic Republic of the Congo",
    "DNK": "Denmark",
    "DJI": "Djibouti",
    "DMA": "Dominica",
    "DOM": "Dominican Republic",
    "ECU": "Ecuador",
    "EGY": "Egypt",
    "SLV": "El Salvador",
    "GNQ": "Equatorial Guinea",
    "ERI": "Eritrea",
    "EST": "Estonia",
    "SWZ": "Eswatini",
    "ETH": "Ethiopia",
    "FJI": "Fiji",
    "FIN": "Finland",
    "FRA": "France",
    "GAB": "Gabon",
    "GMB": "Gambia",
    "GEO": "Georgia",
    "DEU": "Germany",
    "GHA": "Ghana",
    "GRC": "Greece",
    "GRD": "Grenada",
    "GTM": "Guatemala",
    "GIN": "Guinea",
    "GNB": "Guinea-Bissau",
    "GUY": "Guyana",
    "HTI": "Haiti",
    "HND": "Honduras",
    "HUN": "Hungary",
    "ISL": "Iceland",
    "IND": "India",
    "IDN": "Indonesia",
    "IRN": "Iran",
    "IRQ": "Iraq",
    "IRL": "Ireland",
    "ISR": "Israel",
    "ITA": "Italy",
    "JAM": "Jamaica",
    "JPN": "Japan",
    "JOR": "Jordan",
    "KAZ": "Kazakhstan",
    "KEN": "Kenya",
    "KIR": "Kiribati",
    "KWT": "Kuwait",
    "KGZ": "Kyrgyzstan",
    "LAO": "Lao People's Democratic Republic",
    "LVA": "Latvia",
    "LBN": "Lebanon",
    "LSO": "Lesotho",
    "LBR": "Liberia",
    "LBY": "Libya",
    "LTU": "Lithuania",
    "LUX": "Luxembourg",
    "MDG": "Madagascar",
    "MWI": "Malawi",
    "MYS": "Malaysia",
    "MDV": "Maldives",
    "MLI": "Mali",
    "MLT": "Malta",
    "MHL": "Marshall Islands",
    "MRT": "Mauritania",
    "MUS": "Mauritius",
    "MEX": "Mexico",
    "FSM": "Micronesia",
    "MCO": "Monaco",
    "MNG": "Mongolia",
    "MNE": "Montenegro",
    "MAR": "Morocco",
    "MOZ": "Mozambique",
    "MMR": "Myanmar",
    "NAM": "Namibia",
    "NRU": "Nauru",
    "NPL": "Nepal",
    "NLD": "Netherlands",
    "NZL": "New Zealand",
    "NIC": "Nicaragua",
    "NER": "Niger",
    "NGA": "Nigeria",
    "MKD": "North Macedonia",
    "NOR": "Norway",
    "OMN": "Oman",
    "PAK": "Pakistan",
    "PLW": "Palau",
    "PAN": "Panama",
    "PNG": "Papua New Guinea",
    "PRY": "Paraguay",
    "PER": "Peru",
    "PHL": "Philippines",
    "POL": "Poland",
    "PRT": "Portugal",
    "QAT": "Qatar",
    "KOR": "Republic of Korea",
    "MDA": "Republic of Moldova",
    "ROU": "Romania",
    "RUS": "Russian Federation",
    "RWA": "Rwanda",
    "KNA": "Saint Kitts and Nevis",
    "LCA": "Saint Lucia",
    "VCT": "Saint Vincent and the Grenadines",
    "WSM": "Samoa",
    "SMR": "San Marino",
    "STP": "Sao Tome and Principe",
    "SAU": "Saudi Arabia",
    "SEN": "Senegal",
    "SRB": "Serbia",
    "SYC": "Seychelles",
    "SLE": "Sierra Leone",
    "SGP": "Singapore",
    "SVK": "Slovakia",
    "SVN": "Slovenia",
    "SLB": "Solomon Islands",
    "SOM": "Somalia",
    "ZAF": "South Africa",
    "SSD": "South Sudan",
    "ESP": "Spain",
    "LKA": "Sri Lanka",
    "SDN": "Sudan",
    "SUR": "Suriname",
    "SWE": "Sweden",
    "CHE": "Switzerland",
    "SYR": "Syrian Arab Republic",
    "TJK": "Tajikistan",
    "THA": "Thailand",
    "TLS": "Timor-Leste",
    "TGO": "Togo",
    "TON": "Tonga",
    "TTO": "Trinidad and Tobago",
    "TUN": "Tunisia",
    "TUR": "Turkey",
    "TKM": "Turkmenistan",
    "TUV": "Tuvalu",
    "UGA": "Uganda",
    "UKR": "Ukraine",
    "ARE": "United Arab Emirates",
    "GBR": "United Kingdom",
    "TZA": "Tanzania",
    "USA": "United States of America",
    "URY": "Uruguay",
    "UZB": "Uzbekistan",
    "VUT": "Vanuatu",
    "VEN": "Venezuela",
    "VNM": "Viet Nam",
    "YEM": "Yemen",
    "ZMB": "Zambia",
    "ZWE": "Zimbabwe"
}



# Get unique country values from the DataFrame
country_options = [{'label': country, 'value': country} for country in df['Country'].unique()]

# Get unique country ISO-3 codes from the DataFrame to generate suggestions for the country-search bar
iso3_options = [{'label': country_name, 'value': iso3_code} for iso3_code, country_name in iso3_to_country.items()]

print(len(country_options))


# App layout
app.layout = html.Div([
    html.H1("Country Similarity Analysis", style={'text-align': 'center', 'margin': '50px auto'}),  # Center the heading
    html.Div([
        html.Label("Search Country:",
                   style={'display': 'inline-block', 'vertical-align': 'middle', 'margin-right': '10px'}),
        # Align label and input horizontally
        dcc.Dropdown(id="country-input", options=iso3_options, value="USA",
                     style={'width': '200px', 'display': 'inline-block', 'vertical-align': 'middle'})
        # Align input horizontally and set width
    ], style={'text-align': 'center', 'margin-bottom': '10px'}),  # Center the div and add bottom margin
    html.Br(),
    html.Div([
        dcc.RangeSlider(
            id='year-slider',
            min=df['year'].min(),
            max=df['year'].max(),
            value=[df['year'].min(), df['year'].max()],
            marks={
                str(year): {'label': str(year), 'style': {'writing-mode': 'vertical-lr', 'text-orientation': 'upright'}}
                for year in range(df['year'].min(), df['year'].max()+1)},
            step=None
        )
    ], style={'width': '90%', 'margin': '50px auto'}),
    html.Br(),
    html.Div([
        html.Button('All Resolutions', id='btn-0', n_clicks=0, style={'margin-right': '10px', 'background-color': 'white'}),
        html.Button('Israeli-Palestinian Conflict', id='btn-1', n_clicks=0, style={'margin-right': '10px', 'background-color': '#E1E1E1'}),
        html.Button('Nuclear Weapons', id='btn-2', n_clicks=0, style={'margin-right': '10px', 'background-color': '#C3C3C3'}),
        html.Button('Arms Control', id='btn-3', n_clicks=0, style={'margin-right': '10px', 'background-color': '#A5A5A5'}),
        html.Button('Human Rights', id='btn-4', n_clicks=0, style={'margin-right': '10px', 'background-color': '#878787'}),
        html.Button('Colonialism', id='btn-5', n_clicks=0, style={'margin-right': '10px', 'background-color': '#696969'}),
        html.Button('Economic Development', id='btn-6', n_clicks=0, style={'margin-right': '10px', 'background-color': '#4B4B4B'}),
        html.Button('Calculate', id='btn-calculate', n_clicks=0, style={'background-color': 'orange'})
    ], style={'display': 'flex', 'justify-content': 'center', 'margin': '50px auto', 'max-width': '800px'}),
    html.Br(),
    dcc.Graph(
        id='subject-composition',
        style={'height': '300px'}  # Set the height of the bar plot
    ),
    dcc.Graph(
        id='world-map',
        style={'height': '800px'},  # Set the height of the map
        config={'scrollZoom': False}  # Deactivate zooming by scrolling
    ),
])



# Modify the update_layout function
@app.callback(
    [Output('btn-0', 'style'),
     Output('btn-1', 'style'),
     Output('btn-2', 'style'),
     Output('btn-3', 'style'),
     Output('btn-4', 'style'),
     Output('btn-5', 'style'),
     Output('btn-6', 'style'),
     Output('world-map', 'figure'),
     Output('subject-composition', 'figure')],
    [Input('btn-0', 'n_clicks'),
     Input('btn-1', 'n_clicks'),
     Input('btn-2', 'n_clicks'),
     Input('btn-3', 'n_clicks'),
     Input('btn-4', 'n_clicks'),
     Input('btn-5', 'n_clicks'),
     Input('btn-6', 'n_clicks'),
     Input('btn-calculate', 'n_clicks'),
     Input('country-input', 'value'),
     Input('year-slider', 'value')],
    [State('btn-0', 'style'),
     State('btn-1', 'style'),
     State('btn-2', 'style'),
     State('btn-3', 'style'),
     State('btn-4', 'style'),
     State('btn-5', 'style'),
     State('btn-6', 'style')]
)
def update_layout(btn0_clicks, btn1_clicks, btn2_clicks, btn3_clicks, btn4_clicks, btn5_clicks, btn6_clicks, btn_calculate_clicks, country_short, year_range, style0, style1, style2, style3, style4, style5, style6):
    # Determine which button was clicked
    ctx = dash.callback_context
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]

    subject = ['all']

    if btn0_clicks % 2 == 0:
        style0['background-color'] = 'white'
        subject = ['all']
        style1['background-color'] = 'grey'
        style2['background-color'] = 'grey'
        style3['background-color'] = 'grey'
        style4['background-color'] = 'grey'
        style5['background-color'] = 'grey'
        style6['background-color'] = 'grey'
        btn1_clicks = 0
    else:
        subject.remove('all')
        style0['background-color'] = 'grey'

        if btn1_clicks % 2 == 1:
            subject.append('me')
            style1['background-color'] = 'white'
        else:
            style1['background-color'] = 'grey'

        if btn2_clicks % 2 == 1:
            subject.append('nu')
            style2['background-color'] = 'white'
        else:
            style2['background-color'] = 'grey'

        if btn3_clicks % 2 == 1:
            subject.append('di')
            style3['background-color'] = 'white'
        else:
            style3['background-color'] = 'grey'

        if btn4_clicks % 2 == 1:
            subject.append('hr')
            style4['background-color'] = 'white'
        else:
            style4['background-color'] = 'grey'

        if btn5_clicks % 2 == 1:
            subject.append('co')
            style5['background-color'] = 'white'
        else:
            style5['background-color'] = 'grey'

        if btn6_clicks % 2 == 1:
            subject.append('ec')
            style6['background-color'] = 'white'
        else:
            style6['background-color'] = 'grey'

    start_year, end_year = year_range

    if btn_calculate_clicks == 1:
        result = similarity_by_country(df, country_short, start_year, end_year, subject)
        fig_map = px.choropleth(result,
                                locations=result.index,
                                color=country_short,
                                hover_name=result.index,
                                color_continuous_scale='viridis',
                                range_color=[0, 1],
                                title=False)
        fig_map.update_layout(
            plot_bgcolor='white',
            paper_bgcolor='white',
            coloraxis_colorbar_title='Coincidence',
            geo=dict(
                showocean=True,
                oceancolor="#ffffff"
            )
        )

        # Calculate subject composition
        if 'all' in subject:
            # Drop non-numeric columns before summing
            subject_columns = df[['me', 'nu', 'di', 'hr', 'ec', 'co']]
            subject_counts = subject_columns.sum().sort_values(ascending=False) / len(df)
        else:
            subject_counts = df[subject].sum().sort_values(ascending=False) / len(df)

        # Create a stacked horizontal bar chart
        fig_subject = go.Figure()
        subject_colors = ['#E1E1E1', '#C3C3C3', '#A5A5A5', '#878787', '#696969', '#4B4B4B']

        # Add each category as a separate trace in the stacked bar chart
        for i in range(len(subject)):
            if i == 0:
                fig_subject.add_trace(go.Bar(y=[0], x=[subject_counts[i]], name=subject[i], orientation='h',
                                             marker=dict(color=subject_colors[i], line=dict(width=1, color='rgba(0,0,0,0)'))))
            else:
                fig_subject.add_trace(go.Bar(y=[0], x=[subject_counts[i]], name=subject[i], orientation='h',
                                             marker=dict(color=subject_colors[i], line=dict(width=1, color='rgba(0,0,0,0)')),
                                             base=[sum(subject_counts[:i])],))

        # Update layout to stack bars vertically and remove tick labels
        fig_subject.update_layout(barmode='stack', title='Subject Composition',
                                  yaxis=dict(zeroline=False, showticklabels=False),
                                  xaxis=dict(showticklabels=False),
                                  showlegend=False, plot_bgcolor='rgba(0,0,0,0)')

        return style0, style1, style2, style3, style4, style5, style6, fig_map, fig_subject
    else:
        return style0, style1, style2, style3, style4, style5, style6, dash.no_update, dash.no_update



if __name__ == '__main__':
    app.run_server(debug=True)