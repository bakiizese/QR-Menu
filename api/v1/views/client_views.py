from flask import jsonify, request, abort
from api.v1.views import client_bp


@client_bp.route("/get-foods", methods=["GET"])
def get_foods():
    pass


@client_bp.route("/place-order", methods=["POST"])
def place_order():
    """make sure to package orders if multiple ordered by on client or qr or table"""
    pass


@client_bp.route("/update-order", methods=["POST"])
def update_order():
    """update order possible if order not started"""
    pass


@client_bp.route("/delete-order", methods=["POST"])
def delete_order():
    """delete order possible if order not started"""
    pass


@client_bp.route("/restaurant-details", methods=["GET"])
def restaurant_details():
    pass


@client_bp.route("/pay-online", methods=["GET"])
def pay_online():
    pass
