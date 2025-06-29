import random
import string


def generate_random_string(n=20) -> str:
    token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(n))
    print(token)
    return token