""" A DAO to process data from cisco API """
from .cospace import CoSpaceDAO
from .user import UserDAO

__all__ = [
    "CoSpaceDAO",
    "UserDAO",
]
