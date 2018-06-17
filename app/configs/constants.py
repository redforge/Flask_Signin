import string

#Number of digits in the actual number part of the id
id_number_length = 3
#Number of chars. in the verification part of the id
id_verify_length = 1
#List of things to use for the verification bit
id_verify_list = string.ascii_uppercase


#DON'T CHANGE
id_length = id_number_length + id_verify_length
