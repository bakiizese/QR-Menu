from flask import Blueprint

admin_bp = Blueprint("admin_bp", __name__)
chef_bp = Blueprint("chef_bp", __name__)
client_bp = Blueprint("client_bp", __name__)

from api.v1.views.admin_views import *
from api.v1.views.chef_views import *
from api.v1.views.client_views import *
