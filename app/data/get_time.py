import datetime

def get_time():
	dt = datetime.datetime.now()
	return dt.strftime('%-H:%M')

def get_timedate():
    dt = datetime.datetime.now()
    return dt.strftime('%A %B %-d %Y at %-H.%M')
