from models import storage

# check if relationships are active
## print all instance of all classes

classes = ["Admin", "Chef", "Client", "Food", "OrderedFood", "FoodRating", "MenuRating"]

for cls in classes:
    instances = storage.get_all(cls)
    count = storage.count(cls)
    for instance in range(len(instances)):
        if instance == 0:
            print(f"{cls}: {count} : ")
        print(
            f"{instances[instance].to_dict(updated_at='updated_at', created_at='created_at')}"
        )
        if instance + 1 == len(instances):
            print("\n\n")

## print admin relationships
print("\n\n*** print admin relationships ***\n\n")

admins = storage.get_all("Admin")
for admin in admins:
    admin_id = admin.id
    foods = admin.food
    print(f"Admin: {admin.to_dict(updated_at='updated_at', created_at='created_at')}\n")
    for food in foods:
        print(
            f"{admin_id} To Food: {food.to_dict(updated_at='updated_at', created_at='created_at')}\n"
        )

print("\n\n*** print chef relationship ***\n\n")

chefs = storage.get_all("Chef")
for chef in chefs:
    print(f"Chef: {chef.to_dict(updated_at='updated_at', created_at='created_at')}\n")


print("\n\n*** print client relationship ***\n\n")

clients = storage.get_all("Client")
for client in clients:
    print(
        f"Client: {client.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
    orderedfoods = client.orderedfood
    menuratings = client.menurating

    for orderedfood in orderedfoods:
        print(
            f"{client.id}: {orderedfood.to_dict(updated_at='updated_at', created_at='created_at')}\n"
        )
    for menurating in menuratings:
        print(
            f"{client.id}: {menurating.to_dict(updated_at='updated_at', created_at='created_at')}\n"
        )


print("\n\n*** print client relationship ***\n\n")

foods = storage.get_all("Food")
for food in foods:
    print(f"Food: {food.to_dict(updated_at='updated_at', created_at='created_at')}\n")
    admin = food.admin
    orderedfoods = food.orderedfood
    print(
        f"Food-Admin: {admin.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )

    for orderedfood in orderedfoods:
        print(
            f"{food.id}: {orderedfood.to_dict(updated_at='updated_at', created_at='created_at')}\n"
        )


print("\n\n*** print orderedfood relationship ***\n\n")

orderedfoods = storage.get_all("OrderedFood")
for orderedfood in orderedfoods:
    print(
        f"OrderedFood: {orderedfood.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
    foodratings = orderedfood.foodrating
    client = orderedfood.client
    food = orderedfood.food
    print(
        f"OrderedFood-Client: {client.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
    print(
        f"OrderedFood-Food: {food.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
    for foodrating in foodratings:
        print(
            f"{orderedfood.id}: {foodrating.to_dict(updated_at='updated_at', created_at='created_at')}\n"
        )


print("\n\n*** print menurating relationship ***\n\n")

menuratings = storage.get_all("MenuRating")
for menurating in menuratings:
    print(
        f"MenuRating: {menurating.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
    client = menurating.client
    print(
        f"MenuRating-Client: {client.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )


print("\n\n*** print foodrating relationship ***\n\n")

foodratings = storage.get_all("FoodRating")
for foodrating in foodratings:
    print(
        f"FoodRating: {foodrating.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
    orderedfood = foodrating.orderedfood
    print(
        f"FoodRating-OrderedFood: {orderedfood.to_dict(updated_at='updated_at', created_at='created_at')}\n"
    )
