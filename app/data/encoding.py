from app.configs.constants import id_verify_length, id_number_length, id_verify_list, id_length

#Alphanumeric IDs strongly recommended
def encode_id(number):
	#Pad with zeros
	needed_padding = id_number_length - len(str(number))
	padding  = '0'*needed_padding
	#Add verification letter
	verify_char    = id_verify_list[ number % len(id_verify_list) ]

	return padding + str(number) + verify_char

def verify_id(id):
	# TODO: Implement proper verification
	if len(id) != id_length:
		return False
	else:
		return True
	pass
