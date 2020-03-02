import pandas as pd
import numpy as np
import math

#load table
df = pd.read_csv('earthquakes.csv')

# Hour Distribution
hourPeriod = df['time.hour']
countHour = pd.DataFrame(hourPeriod.value_counts())
countHour = countHour.reset_index()
countHour.columns = ['Hour', 'Counts']
sortHour= countHour.sort_values('Hour')
sortHour.to_csv('~/Desktop/DV/DVFinal/Hour.csv')

# State Distribution
State = df['location.name']
countState = pd.DataFrame(State.value_counts())
countState = countState.reset_index()
countState.columns = ['State', 'Counts']
sortState = countState.sort_values('State')
sortState.to_csv('~/Desktop/DV/DVFinal/State.csv')

