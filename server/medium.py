from flask_restful import Resource
from flask_login import current_user
from config import api

class CurrentUser(Resource):
    def get(self):
        if current_user.is_authenticated:
            user_dict = current_user.to_dict()

            return user_dict, 200
        
        else:
            return False
        
api.add_resource(CurrentUser, '/current_user')
