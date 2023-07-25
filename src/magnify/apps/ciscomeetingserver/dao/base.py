""" A base DAO objet """


class BaseDAO:
    """A base DAO objet"""

    def __init__(self, username: str, password: str) -> None:
        self.auth = (username, password)
