from enum import Enum


class UserRole(str, Enum):
    GUEST = "GUEST"
    USER = "USER"
    ADMIN = "ADMIN"


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"


class PaymentProvider(str, Enum):
    PAYMONGO = "PAYMONGO"


class FileType(str, Enum):
    DOCUMENT = "DOCUMENT"
    IMAGE = "IMAGE"
    ID_PHOTO = "ID_PHOTO"


class ColorMode(str, Enum):
    BLACK_AND_WHITE = "BLACK_AND_WHITE"
    COLOR = "COLOR"


class FileStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    DELETED = "DELETED"


class PrintRequestStatus(str, Enum):
    DRAFT = "DRAFT"
    READY = "PENDING"
    PRINTING = "PRINTING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
