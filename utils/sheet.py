import gspread
from google.oauth2.service_account import Credentials
import json
import os
from django.conf import settings

CREDENTIALS_PATH = os.path.join(settings.BASE_DIR, "utils", "credentials.json")


scopes = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']

with open(CREDENTIALS_PATH) as f:
    service_account_info = json.load(f)




creds = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(creds)


def create_sheet(instance , email):
    sh = gc.create(f"{instance.title} response.")
    sh.share(email, perm_type='anyone', role='writer',notify=True, with_link=True)
    worksheet = sh.get_worksheet(0)
    instance.sheet_id = sh.id
    instance.sheet_url = sh.url
    instance.save()
    print("Sheet Created and made public successfully")
    return sh.id, sh.url
