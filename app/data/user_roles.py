def read_role_codes():
    f = open('data/role codes.txt', 'r+')

    out = []
    i = 0
    for line in f.readlines():
        line = line.strip()
        if (line[0]!='#'):
            i += 1
            elements = line.split(':')
            dict = { 'role name':elements[0], 'role codes':elements[1:] }
            out.append(dict)
    return out

def get_role_by_code(role_code):
    roles = read_role_codes() #This line is here so we can change the text file without restarting the server
    index = 0
    for role in roles:
        if (role_code in role['role codes']):
            return (True, roles[index]['role name'])
        index += 1

    return (False, "none")

def read_role_permissions():
    p = open('data/role permissions.txt', 'r')

    out = {}
    i = 0
    for line in p.readlines():
        line = line.strip()
        if (line[0]!='#'):
            i += 1
            elements = line.split(':')
            out[elements[0]]=elements[1:]
    # print(out)
    return out

def has_permission(role, permission):
    permissions = read_role_permissions()
    return permission in permissions[role]
