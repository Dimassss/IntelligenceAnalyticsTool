import requests
import os
from datetime import datetime
from django.conf import settings


def handle_file_upload(file, path, filename):
    os.makedirs(settings.FILE_STORAGE_DIR / path, exist_ok=True)

    with open(settings.FILE_STORAGE_DIR / (path + filename), "wb+") as dest:
        for chunk in file.chunks():
            dest.write(chunk)


def download_from_url(url):
    dt = datetime.now()
    path = "{}/{}/{}/{}/".format(dt.year, dt.month, dt.day, dt.hour)
    filename = str(datetime.timestamp(dt))

    with requests.get(url, allow_redirects=True) as r:
        r.raise_for_status()
        os.makedirs(settings.FILE_STORAGE_DIR / path, exist_ok=True)
        with open(settings.FILE_STORAGE_DIR / (path + filename), 'wb+') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    return {
        'path': path + filename,
        'filename': filename,
        'mimetype': r.headers.get('content-type')
    }


def remove_file(path):
    if os.path.isfile(settings.FILE_STORAGE_DIR / path):
        os.remove(settings.FILE_STORAGE_DIR / path)