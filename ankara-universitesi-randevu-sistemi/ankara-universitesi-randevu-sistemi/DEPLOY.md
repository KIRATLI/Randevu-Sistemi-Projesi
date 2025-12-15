# Vercel'e Deploy Etme Kılavuzu

Bu projeyi Vercel'e deploy etmek için aşağıdaki adımları izleyin:

## 🚀 Hızlı Deploy (Vercel CLI ile)

1. **Vercel CLI'yi yükleyin:**
   ```bash
   npm install -g vercel
   ```

2. **Vercel'e giriş yapın:**
   ```bash
   vercel login
   ```

3. **Proje dizinine gidin:**
   ```bash
   cd ankara-universitesi-randevu-sistemi/ankara-universitesi-randevu-sistemi
   ```

4. **Deploy edin:**
   ```bash
   vercel
   ```

5. **Production'a deploy edin:**
   ```bash
   vercel --prod
   ```

## 🌐 Web Arayüzü ile Deploy

1. [Vercel.com](https://vercel.com) adresine gidin ve hesabınıza giriş yapın (GitHub hesabınızla giriş yapabilirsiniz)

2. **"Add New Project"** butonuna tıklayın

3. GitHub repository'nizi seçin veya import edin

4. **Project Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `ankara-universitesi-randevu-sistemi/ankara-universitesi-randevu-sistemi`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Deploy** butonuna tıklayın

## ⚙️ Önemli Notlar

- Proje mock API kullanıyor, bu yüzden backend bağımlılığı yok
- Tüm route'lar `index.html`'e yönlendirilir (SPA için gerekli)
- Build otomatik olarak `dist` klasörüne yapılır
- Her push'ta otomatik deploy için GitHub entegrasyonunu aktif edin

## 🔧 Environment Variables

Şu an için environment variable gerekmiyor. Gelecekte backend entegrasyonu için gerekirse Vercel dashboard'dan ekleyebilirsiniz.

## 📝 Deploy Sonrası

Deploy tamamlandıktan sonra:
- Vercel size bir URL verecek (örn: `your-project.vercel.app`)
- Bu URL'i arkadaşlarınızla paylaşabilirsiniz
- Her commit'te otomatik deploy yapılacak (GitHub entegrasyonu ile)


