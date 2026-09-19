# this program is first python exercise to analyse customer orders and generate a report
"""
# overview
In this project, you will analyze customer orders using Python data structures to classify
products, identify customer purchasing patterns, and generate business insights. This
analysis will help you understand which products are most popular, which customers
are high-value, and how purchase behavior varies across different categories. You will
leverage lists, tuples, dictionaries, and sets, along with loops and conditionals, to
process and organize customer order data efficiently.
"""

from typing import NamedTuple

newline = "\n----------------------------------"
products = [
    {"id":"001", "name":"Teeth Whitening Kit", "category":"Health & Beauty", "price":1.99, "stock":150},
    {"id":"002", "name":"Wireless Earbuds", "category":"Electronics", "price":2.23, "stock":200},
    {"id":"003", "name":"Yoga Mat", "category":"Sports & Outdoors", "price":1, "stock":100},
    {"id":"004", "name":"Smart Watch", "category":"Electronics", "price":5, "stock":75},
    {"id":"005", "name":"Blender", "category":"Home & Kitchen", "price":2.3, "stock":120},
    {"id":"006", "name":"Running Shoes", "category":"Sports & Outdoors", "price":6, "stock":80},
    {"id":"007", "name":"LED Desk Lamp", "category":"Home & Kitchen", "price":3.99, "stock":60},
    {"id":"008", "name":"Hair Dryer", "category":"Health & Beauty", "price":2.49, "stock":90},
    {"id":"009", "name":"Gaming Mouse", "category":"Electronics", "price":2.65, "stock":150},
    {"id":"010", "name":"Coffee Maker", "category":"Home & Kitchen", "price":4.99, "stock":50}
];
#creating a list of 10 customer with name, email, and total purchase amount
# Create a list of customer names, initialising customer total purchase amount to 0
customers = [
    {"name":"Alice", "email":"alice@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Bob", "email":"bob@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Charlie", "email":"charlie@example.com", "total_purchase":0, "customer_type":""},
    {"name":"David", "email":"david@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Eve", "email":"eve@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Frank", "email":"frank@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Grace", "email":"grace@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Hannah", "email":"hannah@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Ian", "email":"ian@example.com", "total_purchase":0, "customer_type":""},
    {"name":"Jack", "email":"jack@example.com", "total_purchase":0, "customer_type":""}
];
# Store each customer's order details (customer name, product, price, category) as tuples inside a list
# Use a dictionary where keys are customer names and values are lists of ordered products

#product_line_items - it will be product from product list object, so it can act as direct relation for analysis from project object
class Order(NamedTuple):
    id: int
    customer: str
    date: str
    product_line_items: list
    total_spend: float = 0.0

def generate_sample_orders():
    #create a loop of 50 orders with random customer, product, and date
    import random
    from datetime import datetime, timedelta
    orders = []
    for i in range(1, 51):
        date = datetime.now() - timedelta(days=random.randint(0, 30))
        customer = random.choice(customers)["name"]
        # sample picks 3 distinct products; choice could repeat the same one
        chosen_products = random.sample(products, 5)
        product_line_items=[p["id"] for p in chosen_products]
        total_spend=sum([p["price"] for p in chosen_products])
        order = Order(id=i, customer=customer, date=date.strftime("%Y-%m-%d"),
            product_line_items=product_line_items, total_spend=total_spend)
        orders.append(order)
    return orders


list_of_orders = generate_sample_orders()
def analyse_customer_orders():
    for customer in customers:
        purchase_amount = round(customer["total_purchase"],2)
        for order in list_of_orders:
            if(customer["name"] == order.customer):
                purchase_amount += round(order.total_spend,2)
        customer["total_purchase"] = round(purchase_amount,2)
        if purchase_amount > 100:
            customer["customer_type"]="HIGH_VALUE"
        elif purchase_amount >50 and purchase_amount <=100:
            customer["customer_type"]="MEDIUM_VALUE"
        else:
            customer["customer_type"]="LOW_VALUE"

# list from set compre
unique_product_categories = list({p["category"] for p in products})
analyse_customer_orders()

print("All Products", products, newline)
print("All Product Categories", unique_product_categories, newline)
print("All Customers initialised with 0",customers, newline)
print("sample orders", list_of_orders, newline)
print("All Customers with total_price updated", newline)
for customer in customers:
    print(customer, newline)
