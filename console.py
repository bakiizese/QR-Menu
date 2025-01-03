from cmd import Cmd
import os
import shlex
from models import storage
from models.admin import Admin
from models.chef import Chef
from models.client import Client
from models.food import Food
from models.ordered_food import OrderedFood
from models.food_rating import FoodRating
from models.menu_rating import MenuRating

classes = {
    "Admin": Admin,
    "Chef": Chef,
    "Client": Client,
    "Food": Food,
    "OrderedFood": OrderedFood,
    "FoodRating": FoodRating,
    "MenuRating": MenuRating,
}
parental_cols = ["created_at", "updated_at", "id"]


class QRMenuCmd(Cmd):
    prompt = "(QRMenu) "

    def emptyline(self):
        """the method makes sure emptyline commands don\'t raise errors"""
        return False

    def do_EOF(self, arg):
        """the EOF short for end of file command ends or exits the loop"""
        return True

    def do_exit(self, arg):
        """the exit command exits or quits from the cmd loop"""
        return True

    def do_quit(self, arg):
        """the quit command exits or quits from the cmd loop"""
        return True

    def do_clear(self, arg):
        """the clear command clears the command line"""
        if os.name == "nt":
            os.system("cls")
        else:
            os.system("clear")

    def key_parse(self, args):
        """
        the method parses through a list and returns a dictionary the represent the elements in the list.
        i.e. self.key_parse(['name=jack', 'role=manager']) # returns {'name': 'jack', 'role': 'manager'}
        """
        new_dict = {}
        for arg in args:
            if "=" in arg:
                arg = arg.split("=")
                key = arg[0]
                value = arg[1]
                if "," in value:
                    value = value.split(",")
                if len(value) > 0 and value[0] == value[-1] in ["'", '"']:
                    value = shlex.split(value)[0].replace("_", " ")
                else:
                    try:
                        value = int(value)
                    except:
                        try:
                            value = float(value)
                        except:
                            if value == "True":
                                value = True
                            elif value == "False":
                                value = False
                new_dict[key] = value
        return new_dict

    def do_create(self, arg):
        """
        the create command creates an instance by a given class and attributes.
        i.e. create Admin first_name='joe' last_name='dani' role='manager'
             # creates an instance of Admin with the specified attributes and prints an id
        """
        args = arg.split()
        if len(args) < 1:
            print("** class missing **")
            return False
        elif args[0] not in classes.keys():
            print("** class doesn't exists **")
            return False
        data = self.key_parse(args[1:])
        for k in classes[args[0]].__table__.columns.keys():
            if not classes[args[0]].__table__.c[k].nullable and k not in data.keys():
                if k not in parental_cols:
                    print(f"** {k} missing **")
                    return False

        for parental_col in parental_cols:
            if parental_col in data:
                del data[parental_col]
        admin_user = classes[args[0]](**data)
        admin_user.save()
        print(admin_user.id)

    def do_show(self, arg):
        """
        the show command shows all instance of a given
        class or a single instance of a given class and id or attribute.
        i.e. show Admin # shows all instance of class Admin
             show Admin jiwqdj9ej3ejwqoiej03 # shows a single instance jiwqdj9ej3ejwqoiej03
             show Admin role='cashier' first_name='john'
             # shows instance that have role cashier and first_name john
        """
        arg = arg.split()
        new_dict = {}
        if len(arg) < 1:
            print("** class missing **")
            return False
        elif arg[0] not in classes:
            print("** class doesn't exist **")
            return False
        elif len(arg) < 2:
            dict_data = storage.get_all(arg[0])
        else:
            if "=" not in arg[1]:
                arg[1] = f"id={arg[1]}"
            data = self.key_parse(arg[1:])
            cls_keys = classes[arg[0]].__table__.columns.keys()
            for key in data.keys():
                if key not in cls_keys:
                    print(f"{arg[0]} has not attribute '{key}'")
                    return False
            dict_data = storage.get_all(arg[0], **data)
        for data in dict_data:
            new_dict[f"{data.__class__.__name__}.{data.id}"] = data.to_dict()
        print(new_dict)

    def do_update(self, arg):
        """
        the command update updates an instance by a given class and id.
        i.e. update Admin 3iejwqdq91ejwqo first_name='john' # updates the
        first_name of the class instance 3iejwqdq91ejwqo to john
        """
        arg = arg.split()
        if len(arg) < 1:
            print("** class missing **")
            return False
        elif arg[0] not in classes:
            print("** class doesn't exists **")
            return False
        elif len(arg) < 2:
            print("** id missing **")
            return False
        data = self.key_parse(arg[2:])
        cls_keys = classes[arg[0]].__table__.columns.keys()
        for key in data.keys():
            if key not in cls_keys:
                print(f"{arg[0]} has not attribute '{key}'")
                return False
        for col in parental_cols:
            if col in data:
                del data[col]
        update = storage.update(arg[0], arg[1], **data)
        if not update:
            print("** id doesn't exist **")
            return False
        print(f"[{arg[0]}] {arg[1]}: Updated")

    def do_delete(self, arg):
        """
        the delete command deletes an instance by a given class and instance id.
        i.e. delete Admin 2wqn9d323jdwaskd02 # deletes the admin instance 2wqn9d323jdwaskd02
        """
        arg = arg.split()
        if len(arg) < 1:
            print("** class missing **")
            return False
        elif arg[0] not in classes:
            print("** class doesn't exist **")
            return False
        elif len(arg) < 2:
            print("** id missing **")
            return False
        delete = storage.delete(arg[0], arg[1])
        if not delete:
            print("** id doesn't exist **")
            return False
        print(f"[{arg[0]}] {arg[1]}: Deleted")

    def do_count(self, arg):
        """
        the count command counts the number instances of a given class.
        i.e. count all # counts all the instances of all class
             count Admin # counts all the instance of Admin class
        """
        arg = arg.split()
        if len(arg) < 1:
            print("** class missing **")
            return False
        elif arg[0] == "all":
            for k in classes.keys():
                count = storage.count(k)
                print(f"{k}: {count}")
        elif arg[0] in classes.keys():
            count = storage.count(arg[0])
            print(f"{arg[0]}: {count}")
        else:
            print("** class doesn't exists")
            return False


if __name__ == "__main__":
    QRMenuCmd().cmdloop()
