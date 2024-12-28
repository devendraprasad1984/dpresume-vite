from abc import ABC, abstractmethod


class ISerialize(ABC):
    """provides and enforce serialize implementation"""


    @abstractmethod
    def serialize(self):
        pass
