from app.configs.constants import id_verify_length, id_number_length, id_verify_list

def encode_id(number):
	#Pad with zeros
	needed_padding = id_number_length - len(str(number))
	padding  = '0'*needed_padding
	#Add verification letter
	verify_char    = id_verify_list[ number % len(id_verify_list) ]

	return padding + str(number) + verify_char

def verify_id():
	pass
