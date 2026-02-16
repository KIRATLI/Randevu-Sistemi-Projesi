import os

import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext # Şifre hashlemek için ekledik

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Uzun süreli (7 gün)
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Token geçerli mi kontrol eden fonksiyon
def verify_token(token):
    try:
        # leeway=10 diyerek 10 saniyelik saat farklarını görmezden geliyoruz
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=10)
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Şifreyi hashlemek için (Kayıt olurken lazım olacak)
def get_password_hash(password):
    return pwd_context.hash(password)

# Şifreyi doğrulamak için (Login olurken lazım olacak)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)