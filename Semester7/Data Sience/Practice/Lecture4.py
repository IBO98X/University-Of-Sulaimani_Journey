import numpy as np
import pandas as pd
from scipy import stats
from scipy.stats import skew, kurtosis
import matplotlib.pyplot as plt


"""
prices = [500, 550, 600, 650, 700, 700, 700, 750, 800, 850, 900]

median_price = np.median(prices)
mod_price = stats.mode(prices, keepdims=True).mode[0]
mean_price = np.mean(prices)
print("The Median Is: ", median_price)
print("The Mode Is: ", mod_price)
print("The Mean Is: ", mean_price)

plt.hist(prices, bins=8, color='lightblue', edgecolor='black')
plt.title('Laptop Price Distributino')
plt.xlabel('Price($)')
plt.ylabel('Frequency')
plt.show()
"""

# Example 2
prices = [500, 550, 600, 650, 700, 750, 800]
statisfaction = [9, 8, 8, 7, 6, 5, 4]
corr = np.corrcoef(prices, statisfaction)[0,1]
print('Correlation between price and statisfaction', corr)

plt.scatter(prices, statisfaction, color='purple')
plt.title('Price vs Customer Statisfaction')
plt.xlabel('Price ($)')
plt.ylabel('Statisfaction (1-10)')
plt.show()

