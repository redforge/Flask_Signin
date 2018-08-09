import os.path
from app.data.database import init_db, db_path, get_expected_pathname, set_path

def db_exists():
    return os.path.isfile(db_path)

def check_db():
    global db_path

    if (db_path != get_expected_pathname()):
        print('DB Check: Running backup')
        backup_database_to(get_expected_pathname())
        init_db()


    if (not db_exists()):
        print('DB Check: No database found. Making a new one...')
        init_db()
        from app.data.camper_editing import reset_locs
        reset_locs()

def backup_database_to(filename):
    global db_path
    from shutil import copy2
    s = open('data/BACKUPDATA', 'a+')
    s.seek(0)
    prev_path = s.read()
    set_path(filename)

    db_path = filename #this line is a crude fix for some messy scoping

    s.truncate(0)
    s.seek(0)
    s.write(filename)

    if (prev_path == ""):
        print("No previous database found, a new one will be generated. This may happen if the BACKUPDATA file is missing or corrupt.")
        return False
    elif (prev_path == filename):
        print("Tried to back up to the same file!")
    else:
        print ("backing up & copying")
        from app.data.camper_editing import reset_locs
        copy2(prev_path, filename)
        reset_locs()
        return filename
