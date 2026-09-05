# Import all models to make them accessible from the core.models package

from .user import AbstractCustomUser, Student, Academician
from .appointment import Appointment
from .availability import Availability
from .email_template import EmailTemplate
from .message import Message, Thread
from .notification import Notification, NotificationSettings
from .profile import Profile
from .report import SystemReport
from .schedule import Schedule, WorkingSlot