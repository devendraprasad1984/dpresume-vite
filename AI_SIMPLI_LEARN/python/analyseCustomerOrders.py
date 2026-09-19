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
from enum import Enum


class Category(Enum):
    ELECTRONICS = "Electronics"
    HEALTH = "Health & Beauty"
    KITCHEN = "Home & Kitchen"
    SPORTS = "Sports & Outdoors"


newline = "\n----------------------------------"
products = [
    {"id": "001", "name": "Teeth Whitening Kit", "category": Category.HEALTH.value, "price": 1.99, "stock": 150, "total_revenue": 0},
    {"id": "002", "name": "Wireless Earbuds", "category": Category.ELECTRONICS.value, "price": 2.23, "stock": 200, "total_revenue": 0},
    {"id": "003", "name": "Yoga Mat", "category": Category.SPORTS.value, "price": 1, "stock": 100, "total_revenue": 0},
    {"id": "004", "name": "Smart Watch", "category": Category.ELECTRONICS.value, "price": 5, "stock": 75, "total_revenue": 0},
    {"id": "005", "name": "Blender", "category": Category.KITCHEN.value, "price": 2.3, "stock": 120, "total_revenue": 0},
    {"id": "006", "name": "Running Shoes", "category": Category.SPORTS.value, "price": 6, "stock": 80, "total_revenue": 0},
    {"id": "007", "name": "LED Desk Lamp", "category": Category.KITCHEN.value, "price": 3.99, "stock": 60, "total_revenue": 0},
    {"id": "008", "name": "Hair Dryer", "category": Category.HEALTH.value, "price": 2.49, "stock": 90, "total_revenue": 0},
    {"id": "009", "name": "Gaming Mouse", "category": Category.ELECTRONICS.value, "price": 2.65, "stock": 150, "total_revenue": 0},
    {"id": "010", "name": "Coffee Maker", "category": Category.KITCHEN.value, "price": 4.99, "stock": 50, "total_revenue": 0}
];
# creating a list of 10 customer with name, email, and total purchase amount
# Create a list of customer names, initialising customer total purchase amount to 0
customers = [
    {"name": "Alice", "email": "alice@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Bob", "email": "bob@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Charlie", "email": "charlie@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "David", "email": "david@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Eve", "email": "eve@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Frank", "email": "frank@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Grace", "email": "grace@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Hannah", "email": "hannah@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Ian", "email": "ian@example.com", "total_purchase": 0, "customer_type": ""},
    {"name": "Jack", "email": "jack@example.com", "total_purchase": 0, "customer_type": ""}
]


class Order(NamedTuple):
    id: int
    customer: str
    date: str
    product_line_items: list
    total_spend: float = 0.0


def generate_sample_orders():
    """
    1. Store customer orders
    • Create a list of customer names
    • Store each customer's order details (customer name, product, price, category) as
    tuples inside a list
    • Use a dictionary where keys are customer names and values are lists of ordered
    products
    :return:
    """
    # create a loop of 50 orders with random customer, product, and date
    import random
    from datetime import datetime, timedelta
    orders = []
    for i in range(1, 51):
        date = datetime.now() - timedelta(days=random.randint(0, 30))
        customer = random.choice(customers)["name"]
        # sample picks 3 distinct products; choice could repeat the same one
        chosen_products = random.sample(products, 5)
        product_line_items = [
            {"id": p["id"], "price": p["price"], "category": p["category"]}
            for p in chosen_products
        ]
        total_spend = sum([p["price"] for p in chosen_products])
        order = Order(id=i, customer=customer, date=date.strftime("%Y-%m-%d"),
                      product_line_items=product_line_items, total_spend=total_spend)
        orders.append(order)
    return orders


def analyse_customer_orders():
    """
    3. Analyze customer orders
    • Use a loop to calculate the total amount each customer spends
    • If the total purchase value is above $100, classify the customer as a high-value buyer
    • If it is between $50 and $100, classify the customer as a moderate buyer
    • If it is below $50, classify them as a low-value buyer
    """
    for customer in customers:
        purchase_amount = round(customer["total_purchase"], 2)
        for order in list_of_orders:
            if (customer["name"] == order.customer):
                purchase_amount += round(order.total_spend, 2)
        customer["total_purchase"] = round(purchase_amount, 2)
        if purchase_amount > 100:
            customer["customer_type"] = "HIGH_VALUE_BUYER"
        elif purchase_amount > 50 and purchase_amount <= 100:
            customer["customer_type"] = "MEDIUM_VALUE_BUYER"
        else:
            customer["customer_type"] = "LOW_VALUE_BUYER"


def get_product_by_id(id):
    for p in products:
        if p.get("id") == id:
            return p
    return None


def get_unique_product_category():
    """
    2. Classify products by category
    • Use a dictionary to map each product to its respective category
    • Create a set of unique product categories
    • Display all available product categories
    :return:
    """
    uniq_category = list(set([p["category"] for p in products]))
    return [{
        "category_id": c,
        "revenue": 0
    }
        for c in uniq_category
    ]


def generate_business_insights():
    business_insight = {}
    """
    Generate business insights
    • Calculate the total revenue per product category and store it in a dictionary
    • Extract unique products from all orders using a set
    • Use a list comprehension to find all customers who purchased electronics
    • Identify the top three highest-spending customers using sorting
    :return:
    """
    # first get revenue by product, then add product revenues by category
    # updating product as shallow reference update in original products object
    all_products_id = []
    uniq_product_list = [],
    customers_who_purchase_electronics = []
    for order in list_of_orders:
        # get price for every product for that order
        print("order", order)
        customer_name = order.customer
        for order_line in order.product_line_items:
            pid = order_line.get("id")
            all_products_id.append(pid)  # appending all product in a list so unqiue can be found
            product = get_product_by_id(pid)
            is_electronics = product["category"] == Category.ELECTRONICS.value
            if product is not None:
                product["total_revenue"] += order_line.get("price")
            if is_electronics:
                customers_who_purchase_electronics.append(customer_name)

    uniq_product_list = set(all_products_id)
    uniq_product_list_detail = [get_product_by_id(id) for id in uniq_product_list]

    # store revenue by category
    uniq_category = get_unique_product_category()
    for category in uniq_category:
        for product in products:
            if category["category_id"] == product["category"]:
                category["revenue"] += round(product["total_revenue"], 2)

    business_insight["category_revenue"] = uniq_category
    business_insight["uniq_product_list"] = uniq_product_list
    business_insight["uniq_product_list_detail"] = uniq_product_list_detail
    business_insight["customers_who_purchase_electronics"] = set([x for x in customers_who_purchase_electronics])
    return business_insight


list_of_orders = generate_sample_orders()
analyse_customer_orders()
business_insight = generate_business_insights()
list_of_unique_product_categories = [x["category_id"] for x in get_unique_product_category()];

print("All Products", products, newline)
print("All Unique product categories", list_of_unique_product_categories, newline)
print("All Customers with total_price updated", newline)
for customer in customers:
    print(f"{customer["name"], customer["email"], customer["total_purchase"], customer["customer_type"]}")

print("Revenue by product category", newline)
for category_revenue in business_insight["category_revenue"]:
    print(f"{category_revenue["category_id"]} - {category_revenue["revenue"]}")

print("unique product list from all orders", newline)
print("uniq_product_list_detail", [x["id"] + "--" + x["name"] for x in business_insight["uniq_product_list_detail"]])
print("customers_who_purchase_electronics", business_insight["customers_who_purchase_electronics"])
