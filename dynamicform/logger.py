import logging.config
import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    'formatters': {
        'verbose': {
            'format': '[{levelname}] {asctime} {name} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },

    'handlers': {
        'file_error': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/error.log'),
            'formatter': 'verbose',
        },
        'file_server': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/server.log'),
            'formatter': 'verbose',
        },
        'console': {
            'class': 'logging.StreamHandler',
        },
    },

    'root': {
        'handlers': ['console', 'file_error'],
        'level': 'WARNING',
    },

    'loggers': {
        'django': {
            'handlers': ['console', 'file_server'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {   # logs unhandled exceptions
            'handlers': ['file_error'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}
