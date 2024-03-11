import pandas as pd
import numpy as np

df = pd.read_csv("UNGAVotes.csv")

# Identify rows where "Country" is incorrect, in 91 resolution the value of "Countryname" is in "Country" and the value of "Country" is missing
incorrect_country_rows = df[df['Country'].str.len() > 3]
# Transfer values from "Country" to "Countryname" in incorrect rows
df.loc[incorrect_country_rows.index, 'Countryname'] = incorrect_country_rows['Country'].str.capitalize()
# take the correct names from the first resolution (Nr. 1001)
correct_names = df.loc[df["resid"] == 1001, ["Country", "Countryname"]]
# Replace incorrect "Country" values with correct ones from correct_names
mapping_dict = dict(zip(correct_names["Countryname"], correct_names["Country"]))
df.loc[incorrect_country_rows.index, "Country"] = df.loc[incorrect_country_rows.index, "Countryname"].map(mapping_dict)

# delete countries that no longer exists, only the 193 states that are currently present in the UN remain
current_states = df[df['resid'] == 66001]["Country"].unique()
df = df[df["Country"].isin(current_states)]

# changing yugoslavia (yug) to serbia (srb) because it's still yug in 2022
df['Country'] = df['Country'].replace('YUG', 'SRB')

# add a year column out of the date column
df['year'] = df['date'].apply(lambda x: int(x[:4]))

df.to_csv("cleanedUNGAVotes.csv")