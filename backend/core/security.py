import jwt
from datetime import datetime, timedelta
from django.utils import timezone
from passlib.context import CryptContext
from django.conf import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = timezone.now() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Uzun süreli (7 gün)
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = timezone.now() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Token geçerli mi kontrol eden fonksiyon
def verify_token(token):
    try:
        if not SECRET_KEY:
            print("HATA: SECRET_KEY bulunamadı! Token doğrulanamaz.")
            return None

        # leeway=10 diyerek 10 saniyelik saat farklarını görmezden geliyoruz
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=10)
        return payload
    except jwt.ExpiredSignatureError:
        print("HATA: Token süresi dolmuş.")
        return None
    except jwt.InvalidTokenError as e:
        print(f"HATA: Geçersiz Token! Detay: {e}")
        return None

# Şifreyi hashlemek için (Kayıt olurken lazım olacak)
def get_password_hash(password):
    return pwd_context.hash(password)

# Şifreyi doğrulamak için (Login olurken lazım olacak)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)