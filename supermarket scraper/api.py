
def get_product_search_url(search_term):
    return "https://www.woolworths.com.au/apis/ui/Search/count?SearchTerm={}".format(search_term)

def get_product_inventory_url(product_id, results, postcode):
    return "https://www.woolworths.com.au/apis/ui/product/{}/Stores?IncludeInStockStoreOnly=false&Max={}&Postcode={}".format(product_id, results, postcode)

