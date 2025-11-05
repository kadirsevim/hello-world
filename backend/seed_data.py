# Initial seed data for database

categories = [
    {"id": 1, "name": "Yangın Söndürücüler", "slug": "yangin-sonduruculer", "icon": "flame"},
    {"id": 2, "name": "Sprinkler Sistemleri", "slug": "sprinkler-sistemleri", "icon": "droplets"},
    {"id": 3, "name": "Algılama Sistemleri", "slug": "algilama-sistemleri", "icon": "bell"},
    {"id": 4, "name": "Köpük Sistemleri", "slug": "kopuk-sistemleri", "icon": "spray-can"},
    {"id": 5, "name": "Gazlı Söndürme", "slug": "gazli-sondurme", "icon": "wind"},
    {"id": 6, "name": "Yangın Dolapları", "slug": "yangin-dolaplari", "icon": "cabinet-filing"}
]

products = [
    {
        "id": "1",
        "name": "ABC Kuru Kimyevi Tozlu Yangın Söndürücü 6 KG",
        "slug": "abc-kuru-kimyevi-6kg",
        "category": "Yangın Söndürücüler",
        "category_id": 1,
        "price": 850,
        "image": "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=500",
        "description": "A, B ve C sınıfı yangınlarda kullanılabilen, yüksek kaliteli yangın söndürücü.",
        "features": ["6 KG kapasiteli", "ABC sınıfı yangınlar için", "TSE Belgeli", "2 yıl garanti", "Kolay kullanım"],
        "stock": 45,
        "rating": 4.8
    },
    {
        "id": "2",
        "name": "CO2 Karbondioksit Yangın Söndürücüsü 10 KG",
        "slug": "co2-yangin-sondurucusu-10kg",
        "category": "Yangın Söndürücüler",
        "category_id": 1,
        "price": 1250,
        "image": "https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=500",
        "description": "Elektrikli ekipmanlar ve B sınıfı yangınlar için ideal CO2 söndürücü.",
        "features": ["10 KG kapasiteli", "Elektrikli cihazlar için güvenli", "TSE Belgeli", "2 yıl garanti", "Kalıntı bırakmaz"],
        "stock": 28,
        "rating": 4.9
    },
    {
        "id": "3",
        "name": "Otomatik Sprinkler Başlık - Standart Tepkili",
        "slug": "otomatik-sprinkler-baslik",
        "category": "Sprinkler Sistemleri",
        "category_id": 2,
        "price": 180,
        "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500",
        "description": "Standart tepkili otomatik sprinkler başlığı, 68°C aktivasyon sıcaklığı.",
        "features": ["68°C aktivasyon", "Pirinç gövde", "EN 12259 standartları", "Kolay montaj", "5 yıl garanti"],
        "stock": 150,
        "rating": 4.7
    },
    {
        "id": "4",
        "name": "Adresli Duman Dedektörü",
        "slug": "adresli-duman-dedektoru",
        "category": "Algılama Sistemleri",
        "category_id": 3,
        "price": 420,
        "image": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        "description": "Yüksek hassasiyetli adresli duman algılama dedektörü.",
        "features": ["Adreslenebilir", "Yüksek hassasiyet", "EN 54-7 sertifikalı", "Test butonu", "3 yıl garanti"],
        "stock": 85,
        "rating": 4.6
    },
    {
        "id": "5",
        "name": "Yangın Dolabı Komple Set - 25 Metre Hortumlu",
        "slug": "yangin-dolabi-25m",
        "category": "Yangın Dolapları",
        "category_id": 6,
        "price": 2800,
        "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500",
        "description": "Komple yangın dolabı seti, 25 metre hortum ve tüm aksesuarlar dahil.",
        "features": ["25 metre hortum", "Çelik dolap", "Valf ve lans dahil", "TSE Belgeli", "Duvara monte"],
        "stock": 12,
        "rating": 4.9
    },
    {
        "id": "6",
        "name": "AFFF Köpük Yangın Söndürücü 9 Litre",
        "slug": "afff-kopuk-sondurucusu-9l",
        "category": "Köpük Sistemleri",
        "category_id": 4,
        "price": 980,
        "image": "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=500",
        "description": "Hidrokarbon yangınları için yüksek performanslı AFFF köpük söndürücü.",
        "features": ["9 litre kapasiteli", "AFFF köpük", "Hidrokarbon yangınları", "TSE Belgeli", "Paslanmaz çelik"],
        "stock": 32,
        "rating": 4.7
    },
    {
        "id": "7",
        "name": "FM-200 Gazlı Söndürme Sistemi",
        "slug": "fm200-gazli-sondurme",
        "category": "Gazlı Söndürme",
        "category_id": 5,
        "price": 8500,
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
        "description": "Sunucu odaları ve hassas alanlar için FM-200 gazlı söndürme sistemi.",
        "features": ["FM-200 gazı", "Hassas ekipman için", "Hızlı söndürme", "Çevre dostu", "Profesyonel kurulum"],
        "stock": 5,
        "rating": 5.0
    },
    {
        "id": "8",
        "name": "Konvansiyonel Yangın Alarm Paneli",
        "slug": "konvansiyonel-alarm-paneli",
        "category": "Algılama Sistemleri",
        "category_id": 3,
        "price": 1850,
        "image": "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500",
        "description": "8 bölgeli konvansiyonel yangın alarm paneli.",
        "features": ["8 bölge", "LCD ekran", "Backup batarya", "EN 54-2 sertifikalı", "Kolay programlama"],
        "stock": 18,
        "rating": 4.5
    }
]

blog_posts = [
    {
        "id": "1",
        "title": "Yangın Söndürme Sistemleri Neden Gereklidir?",
        "slug": "yangin-sondurme-sistemleri-neden-gereklidir",
        "excerpt": "Yangın söndürme sistemlerinin önemi ve işletmeniz için neden zorunlu olduğunu detaylı olarak inceliyoruz.",
        "content": "Yangın, hem can hem de mal kaybına yol açabilen en yıkıcı afetlerden biridir. Çoğu zaman aniden ortaya çıkar ve müdahale edilmediği takdirde dakikalar içinde büyük zararlara neden olabilir. Bu nedenle yangın söndürme sistemleri, yalnızca bir güvenlik önlemi değil, hayat kurtaran bir yatırımdır.\n\nYangın söndürme sistemlerinin en temel amacı, insan hayatını korumak ve maddi kayıpları en aza indirmektir. Otomatik yangın söndürme sistemleri, yangın henüz başlangıç aşamasındayken devreye girer ve büyümesini engeller.\n\nErken algılama ve hızlı müdahale, yangının büyük felakete dönüşmesini engeller. Sprinkler, gazlı veya köpüklü sistemler gibi modern çözümler, yangını otomatik olarak tespit eder ve anında söndürme işlemini başlatır.",
        "image": "https://images.unsplash.com/photo-1595254204358-884a04f1cf0c?w=800",
        "author": "YZR Yangın Ekibi",
        "category": "Yangın Güvenliği",
        "read_time": "5 dakika"
    },
    {
        "id": "2",
        "title": "Sprinkler Sistemleri: Çeşitleri ve Avantajları",
        "slug": "sprinkler-sistemleri-cesitleri",
        "excerpt": "Sprinkler sistemlerinin farklı türlerini ve her birinin kullanım alanlarını keşfedin.",
        "content": "Sprinkler sistemleri, yangın söndürme alanında en etkili otomatik sistemlerden biridir. Farklı türleri ve kullanım alanları bulunmaktadır. Islak borulu sistemler, en yaygın kullanılan sprinkler türüdür ve boruların içi sürekli su doludur.\n\nKuru borulu sistemler ise donma riski olan alanlarda tercih edilir. Deluge sistemleri, hızlı yayılma riski olan alanlarda kullanılır ve tüm sprinklerler aynı anda aktive olur.\n\nSprinkler sistemleri, 7/24 otomatik koruma sağlar ve insan müdahalesine gerek kalmadan yangına anında müdahale eder. Ayrıca sadece yangının olduğu bölgede devreye girer, bu da su hasarını minimize eder.",
        "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
        "author": "Mühendis Ahmet Yılmaz",
        "category": "Teknik Bilgiler",
        "read_time": "7 dakika"
    },
    {
        "id": "3",
        "title": "Yangın Söndürücü Bakımı: Ne Zaman ve Nasıl?",
        "slug": "yangin-sondurucu-bakimi",
        "excerpt": "Yangın söndürücülerinizin etkin çalışması için düzenli bakım önerileri.",
        "content": "Yangın söndürücüler düzenli bakım gerektirir. Bu yazımızda bakım periyotları ve dikkat edilmesi gereken noktaları anlatıyoruz. Yangın söndürücüler ayda bir görsel kontrol edilmelidir.\n\nManometre kontrolü, söndürücünün basınç durumunu gösterir. Yeşil bölgede olması gerekir. Yıllık periyodik bakım, yetkili servislerce yapılmalıdır ve etiket ile belgelendirilmelidir.\n\n5 yılda bir iç kontrol ve 10 yılda bir hidrostatik test yapılması zorunludur. Yangın söndürücüler kolay erişilebilir yerlerde, zemin seviyesinden maksimum 1.20 metre yükseklikte monte edilmelidir.",
        "image": "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=800",
        "author": "Teknik Ekip",
        "category": "Bakım & Onarım",
        "read_time": "4 dakika"
    }
]

projects = [
    {
        "id": "1",
        "title": "AVM Yangın Güvenlik Sistemi",
        "client": "İstanbul AVM",
        "category": "Alışveriş Merkezi",
        "description": "15.000 m² alışveriş merkezi için tam entegre yangın güvenlik sistemi kurulumu.",
        "image": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=800",
        "year": 2024,
        "features": ["Sprinkler Sistemi", "Algılama Sistemi", "Sesli Uyarı", "Acil Aydınlatma"]
    },
    {
        "id": "2",
        "title": "Fabrika Yangın Söndürme Projesi",
        "client": "Endüstri A.Ş.",
        "category": "Endüstriyel Tesis",
        "description": "Üretim tesisi için özel tasarım gazlı ve köpüklü söndürme sistemi.",
        "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
        "year": 2024,
        "features": ["FM-200 Sistemi", "Köpük Sistemi", "24/7 İzleme", "Otomatik Müdahale"]
    },
    {
        "id": "3",
        "title": "Ofis Binası Güvenlik Çözümü",
        "client": "Plaza B",
        "category": "Ofis Binası",
        "description": "20 katlı ofis binası için kapsamlı yangın algılama ve söndürme sistemi.",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        "year": 2023,
        "features": ["Adresli Algılama", "Sprinkler", "Yangın Dolapları", "Acil Anons"]
    },
    {
        "id": "4",
        "title": "Otel Yangın Güvenlik Sistemi",
        "client": "Grand Hotel",
        "category": "Otel",
        "description": "250 odalı otel için tam entegre yangın güvenlik çözümü.",
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "year": 2023,
        "features": ["Oda Detektörleri", "Koridor Sprinklerleri", "Kaçış Aydınlatması", "Santral Entegrasyonu"]
    }
]