from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    from api.v1.views import admin_bp, chef_bp, client_bp

    app.register_blueprint(admin_bp, url_prefix="/api/v1/admin")
    app.register_blueprint(chef_bp, url_prefix="/api/v1/chef")
    app.register_blueprint(client_bp, url_prefix="/api/v1/client")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=1)
