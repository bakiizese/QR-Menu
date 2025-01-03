from flask import jsonify, abort, request
from api.v1.views import admin_bp


@admin_bp.rooute("/admin-register", methods=["POST"])
def register_admin():
    pass


@admin_bp.route("/get-foods", methods=["GET"])
def get_foods():
    pass


@admin_bp.route("/get-food", methods=["GET"])
def get_food():
    pass


@admin_bp.route("/update-food/<food_id>", methods=["PUT"])
def update_food(food_id):
    pass


@admin_bp.route("/add-food", methods=["POST"])
def add_food():
    pass


@admin_bp.route("/delete-food", methods=["PUT"])
def delete_food():
    pass


@admin_bp.route("/get-food-orders", methods=["GET"])
def get_food_orders():
    """by table, time, ..."""
    pass


@admin_bp.route("/get-food-order", methods=["GET"])
def get_food_order():
    pass


@admin_bp.route("/get-food-ratings", methods=["GET"])
def get_food_ratings():
    pass


@admin_bp.route("/get-food-rating", methods=["GET"])
def get_food_rating():
    """in more detailed way by the relationships inside"""
    pass


@admin_bp.route("/get-served-foods", methods=["GET"])
def get_served_foods():
    pass


@admin_bp.route("/get-order-history", methods=["GET"])
def get_order_history():
    pass


@admin_bp.route("/add-announcement", methods=["GET"])
def add_announcement():
    pass
