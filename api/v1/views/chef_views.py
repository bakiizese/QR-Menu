from flask import jsonify, request, abort
from api.v1.views import chef_bp


@chef_bp.route("/get-orders", methods=["GET"])
def get_orders():
    pass


@chef_bp.route("/updated_served/<orderedfood_id", methods=["PUT"])
def update_served(orderedfood_id):
    pass


@chef_bp.route("/update_started/<orderedfood_id", methods=["PUT"])
def updated_started(orderedfood_id):
    pass


@chef_bp.route("/reorder/<orderedfood_id>", methods=["PUT"])
def reorder(orderedfood_id):
    """when orders or voice orders are not understood"""
    pass
