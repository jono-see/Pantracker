import pandas as pd
import numpy as np 
from bs4 import BeautifulSoup
import requests
import json
from api import *

products = [
    "Apple",
    "Banana",
    "Toilet Paper",
    "Rice"
]

def search_products(products):

    df_array = []

    for product in products:
        try:
            search_url = get_product_search_url(product)
            req = requests.get(search_url).text
            dictionary = json.loads(req) 
            df = pd.DataFrame([dictionary["SearchCount"]])
            df["Product"] = product
            df_array.append(df)

        except:
            pass

    df = pd.concat(df_array)
    
    return df

def get_product_inventory(product_id, max_results, postcode):

    product_inventory_url = get_product_inventory_url(product_id, max_results, postcode)
    req = requests.get(stock_url).text
    dictionary = json.loads(req) 
    df = pd.DataFrame(dictionary)
    
    return df


if __name__ == "__main__":
    product_inventory = get_product_inventory("130935", 500, "3150")
    # product_inventory.to_csv("data/data.csv")




