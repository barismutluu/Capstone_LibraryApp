# LibraryApp

LibraryApp, bir kütüphane yönetim sistemidir. Bu proje, kullanıcıların Yayımcı, Kategori, Kitap, Yazar ve Kitap Alma işlemleri için CRUD (Oluşturma, Okuma, Güncelleme, Silme) operasyonlarını gerçekleştirmelerine olanak tanır. Proje, React Router kullanılarak oluşturulmuş tek sayfalık bir uygulamadır (SPA).

## Canlı Demo

Proje şu adreste canlı olarak görülebilir: [LibraryApp Canlı Demo](https://amazing-zuccutto-1606de.netlify.app/)

## Proje Özellikleri

### Geliştirme Teknolojileri

- **Frontend**: React, React Router
- **Tasarım**: CSS, Tailwind, Material, Bootstrap
- **Backend ve Database**: Canlıya alınmış ve veritabanıyla bağlantılı bir backend.

### Sayfalar ve CRUD İşlemleri

Proje aşağıdaki sayfalardan oluşmaktadır ve her bir sayfada CRUD işlemleri gerçekleştirilebilmektedir:

- **Ana Sayfa**: Projenin genel tanıtımı ve kullanıcıya rehberlik eden bilgiler.
- **Yayımcı**: Yayımcı ekleme, güncelleme, okuma ve silme işlemleri.
- **Kategori**: Kategori ekleme, güncelleme, okuma ve silme işlemleri.
- **Kitap**: Kitap ekleme, güncelleme, okuma ve silme işlemleri.
- **Yazar**: Yazar ekleme, güncelleme, okuma ve silme işlemleri.
- **Kitap Alma**: Kullanıcılar kitap ödünç alabilir, bu kayıtları yönetebilir.

### Kullanıcı Deneyimi

- CRUD işlemleri esnasında hata oluşursa kullanıcıya modal pencereleri ile bilgi verilir.
- **Window.alert** kullanılmamaktadır; bu sayede kullanıcı deneyimi daha profesyonel ve modern bir şekilde sağlanır.
- Proje **1200px** genişliğinde sabit bir layout ile tasarlanmıştır. **Responsive** (duyarlı) tasarım uygulanmamıştır.

### Kurulum ve Kullanım

1. Bu repoyu klonlayın:
   ```bash
   git clone https://github.com/barismutluu/LibraryApp
   ```
2. Gerekli bağımlılıkları yüklemek için proje dizininde şu komutu çalıştırın:

   ```bash
   npm install
   ```

3. Projeyi başlatmak için

   ```bash
   npm run dev
   ```
