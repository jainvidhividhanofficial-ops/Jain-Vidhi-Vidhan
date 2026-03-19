
export interface Service {
    id: number;
    title: string;
    category: string;
    duration: string;
    price: number;
    description: string;
    image: string;
}

export interface EventPackage {
    id: number;
    title: string;
    category: string;
    duration: string;
    description: string;
    includes: string[];
    price: number;
    image: string;
}

export const allServicesData: Service[] = [
    { id: 1, title: "Daily Jin Pooja", category: "Pooja", duration: "1 hour 30 minutes", price: 1500, description: "Experience the serenity of a traditional Jain Jin Pooja performed by an experienced Panditji. Includes idol Abhishek, Ashtaprakari Pooja, and Aarti.", image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
    { id: 2, title: "Family Function Vidhan", category: "Family Functions", duration: "3 hours", price: 3000, description: "Complete Vidhan for family ceremonies with all traditional rituals and chanting for auspicious occasions.", image: "https://i.pinimg.com/1200x/58/a6/01/58a601420a95163b88aa4cafdc2f50a8.jpg" },
    { id: 3, title: "Swadhyay Session", category: "Swadhyay", duration: "2 hours", price: 1200, description: "Interactive group study of Jain scriptures led by a learned scholar for spiritual growth and clarity.", image: "https://i.pinimg.com/1200x/81/8f/d8/818fd881de48088d87a19527e8ec5101.jpg" },
    { id: 4, title: "Morning Pravachan", category: "Pravachan", duration: "1 hour", price: 800, description: "Daily spiritual talk covering Jain philosophy and ethics to inspire peaceful living and mindfulness.", image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
    { id: 5, title: "Samvatsari Pooja", category: "Pooja", duration: "2 hours 30 minutes", price: 2500, description: "Annual Samvatsari rituals performed with complete prayers and pratikraman to mark forgiveness day.", image: "https://i.pinimg.com/1200x/58/a6/01/58a601420a95163b88aa4cafdc2f50a8.jpg" },
    { id: 6, title: "Mahavir Jayanti Celebration", category: "Vidhan", duration: "4 hours", price: 5000, description: "Grand celebration of Lord Mahavir’s birth with procession, aarti, and cultural activities.", image: "https://i.pinimg.com/1200x/81/8f/d8/818fd881de48088d87a19527e8ec5101.jpg" },
    { id: 7, title: "Navkar Mantra Chanting", category: "Swadhyay", duration: "45 minutes", price: 700, description: "Guided group chanting session of the sacred Navkar Mantra to bring positivity and calmness.", image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
    { id: 8, title: "Wedding Pooja", category: "Family Functions", duration: "5 hours", price: 8000, description: "Traditional Jain wedding rituals conducted with authenticity and blessings for a happy married life.", image: "https://i.pinimg.com/1200x/58/a6/01/58a601420a95163b88aa4cafdc2f50a8.jpg" },
    { id: 9, title: "Evening Aarti & Bhakti", category: "Pooja", duration: "1 hour", price: 1000, description: "Beautiful evening devotional aarti and bhakti session with live music and chanting.", image: "https://i.pinimg.com/1200x/81/8f/d8/818fd881de48088d87a19527e8ec5101.jpg" },
];

export const allPackagesData: EventPackage[] = [
    { id: 1, title: "Pooja Celebration Package", category: "Pooja", duration: "2-3 hours", description: "Complete Pooja package.", includes: ["Pandit", "Samagri"], price: 5000, image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
    { id: 2, title: "Family Function Deluxe", category: "Family Functions", duration: "3-5 hours", description: "Perfect for family events.", includes: ["Pandit", "Decor"], price: 8000, image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
    { id: 3, title: "Swadhyay Ceremony", category: "Swadhyay", duration: "2-3 hours", description: "Host a Swadhyay session.", includes: ["Speaker", "Sound System"], price: 3000, image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
    { id: 4, title: "Vidhan Event Package", category: "Vidhan", duration: "4-6 hours", description: "Organize a grand Vidhan.", includes: ["Senior Pandits", "Mandap"], price: 10000, image: "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg" },
];
