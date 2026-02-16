# Import all models to make them accessible from the core.models package

from .user import AbstractCustomUser, Student, Academician
from .availability import Availability
from .appointment import Appointment