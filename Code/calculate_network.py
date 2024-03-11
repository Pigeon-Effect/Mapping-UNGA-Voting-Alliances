import pandas as pd
import numpy as np

df = pd.read_csv("cleanedUNGAVotes.csv")

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

countries = df["Country"].unique()

for country in countries:
    result = similarity_by_country(df, country, 2020, 2022, ["di"])
    result.to_csv(f"network_results/{country}.csv")
    print(country + " is finished")