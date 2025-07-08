import random
import string
from django.utils import timezone
from datetime import timedelta

def generate_random_string(n=20) -> str:
    token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(n))
    return token


def convert_to_local_time_zone():
    local_now = timezone.localtime(timezone.now())
    today_start = local_now.replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow_start = today_start + timedelta(days=1)
    return today_start , tomorrow_start