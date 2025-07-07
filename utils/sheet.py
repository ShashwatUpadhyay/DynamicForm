import gspread
from google.oauth2.service_account import Credentials
import json


scopes = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']

with open('utils/credentials.json') as f:
    service_account_info = json.load(f)




creds = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(creds)


def create_sheet(instance , email):
    sh = gc.create(f"{instance.form.title} response.")
    sh.share(email, perm_type='user', role='writer',notify=True, with_link=True)
    worksheet = sh.get_worksheet(0)

    print(sh.url)
    sh.list_permissions()
    print(worksheet)
    return sh.id, sh.url
