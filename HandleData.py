import pandas as pd
import numpy as np
import math

#load table
df = pd.read_csv('earthquakes.csv')
StateName = df['name']
df = df[df.name != 'Afghanistan']
df = df[df.name != 'Anguilla']
df = df[df.name != 'Argentina']
df = df[df.name != 'Ascension Island region']
df = df[df.name != 'Australia']
df = df[df.name != 'Azerbaijan']
df = df[df.name != 'Azores-Cape St. Vincent Ridge']
df = df[df.name != 'Bolivia']
df = df[df.name != 'British Virgin Islands']
df = df[df.name != 'Canada']
df = df[df.name != 'Central East Pacific Rise']
df = df[df.name != 'Central Mid-Atlantic Ridge']
df = df[df.name != 'Chagos Archipelago region']
df = df[df.name != 'Chile']
df = df[df.name != 'China']
df = df[df.name != 'Christmas Island']
df = df[df.name != 'Colombia']
df = df[df.name != 'Dominican Republic']
df = df[df.name != 'East Timor']
df = df[df.name != 'East of the Kuril Islands']
df = df[df.name != 'Ecuador']
df = df[df.name != 'El Salvador']
df = df[df.name != 'Fiji']
df = df[df.name != 'Fiji region']
df = df[df.name != 'Greece']
df = df[df.name != 'Greenland Sea']
df = df[df.name != 'Guam']
df = df[df.name != 'Guatemala']
df = df[df.name != 'Idaho']
df = df[df.name != 'Iran']
df = df[df.name != 'India']
df = df[df.name != 'Iran']
df = df[df.name != 'Italy']
df = df[df.name != 'Japan']
df = df[df.name != 'Japan region']
df = df[df.name != 'Kiribati region']
df = df[df.name != 'Kyrgyzstan']
df = df[df.name != 'Martinique']
df = df[df.name != 'Mid-Indian Ridge']
df = df[df.name != 'New Caledonia']
df = df[df.name != 'Nicaragua']
df = df[df.name != 'North of Ascension Island']
df = df[df.name != 'North of Svalbard']
df = df[df.name != 'Northern Mariana Islands']
df = df[df.name != 'Northern Mid-Atlantic Ridge']
df = df[df.name != 'Northwest of Australia']
df = df[df.name != 'Off the coast of Oregon']
df = df[df.name != 'Pacific-Antarctic Ridge']
df = df[df.name != 'Pakistan']
df = df[df.name != 'Palau']
df = df[df.name != 'Papua New Guinea']
df = df[df.name != 'Peru']
df = df[df.name != 'Philippines']
df = df[df.name != 'Reykjanes Ridge']
df = df[df.name != 'South Georgia Island region']
df = df[df.name != 'Russia']
df = df[df.name != 'Solomon Islands']
df = df[df.name != 'South Georgia and the South Sandwich Islands']
df = df[df.name != 'South Indian Ocean']
df = df[df.name != 'South Sandwich Islands']
df = df[df.name != 'South of Panama']
df = df[df.name != 'South of the Fiji Islands']
df = df[df.name != 'Southern East Pacific Rise']
df = df[df.name != 'Southern Mid-Atlantic Ridge']
df = df[df.name != 'Southwest Indian Ridge']
df = df[df.name != 'Syria']
df = df[df.name != 'Taiwan']
df = df[df.name != 'Tajikistan']
df = df[df.name != 'Ukraine']
df = df[df.name != 'Turkey']
df = df[df.name != 'Ukraine']
df = df[df.name != 'Ukraine']
df = df[df.name != 'Vanuatu']
df = df[df.name != 'Vanuatu region']
df = df[df.name != 'Venezuela']
df = df[df.name != 'Virgin Islands region']
df = df[df.name != 'Virgin Islands region']
df = df[df.name != 'Western Xizang']
df = df[df.name != 'Burma']
df = df[df.name != 'Cyprus']
df = df[df.name != 'Kuril Islands']
df = df[df.name != 'Mexico']
df = df[df.name != 'Portugal']
df = df[df.name != 'Poland']
df = df[df.name != 'Tonga']
df = df[df.name != 'U.S. Virgin Islands']
df = df[df.name != 'Uzbekistan']
df = df[df.name != 'Western Indian-Antarctic Ridge']
df = df[df.name != 'Indonesia']
df = df[df.name != 'New Zealand']




df.to_csv('~/Desktop/DV/final-master-1/earthquakes.csv')






# Hour Distribution
hourPeriod = df['hour']
countHour = pd.DataFrame(hourPeriod.value_counts())
countHour = countHour.reset_index()
countHour.columns = ['Hour', 'Counts']
sortHour= countHour.sort_values('Hour')
sortHour.to_csv('~/Desktop/DV/final-master-1/Hour.csv')

# State Distribution
State = df['name']
countState = pd.DataFrame(State.value_counts())
countState = countState.reset_index()
countState.columns = ['State', 'Counts']
sortState = countState.sort_values('State')
sortState.to_csv('~/Desktop/DV/final-master-1/State.csv')

