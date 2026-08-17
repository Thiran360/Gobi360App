// Maps spoken words (English + Tamil) to portfolio screen names
import { SERVICE_KEYWORDS, EXPERT_KEYWORDS } from './searchKeywords';

export type PortfolioScreen =
    | 'SkylinePortfolio'
    | 'SkylineServiceDetail'
    | 'SpokenHindiPortfolio'
    | 'WoodZonePortfolio'
    | 'GVBuildtechPortfolio'

    | 'Thiran360AIPortfolio'
    | 'SwarajTractorPortfolio'
    | 'SunPowerPortfolio'
    | 'ManojSteelsPortfolio'
    | 'STGEsportsPortfolio'
    | 'MejesticStudioPortfolio'
    | 'SakthiElectricalsPortfolio'
    | 'GanagatharaPortfolio'
    | 'SriJeyamPortfolio'
    | 'SriJeyamServiceDetail'
    | 'AbiramiPortfolio'
    | 'Experts'; // Allow fallback to Experts screen with filter

export interface PortfolioMatch {
    screen: PortfolioScreen;
    name: string;
    name_ta: string;
    description: string;
    description_ta: string;
    icon: string;
    color: string;
    bg: string;
    image: any;
    keywords: string[];
    category?: string;
    /** For SkylineServiceDetail deep-links: which service to open (1–4) */
    serviceId?: number;
    isDynamicExpert?: boolean;
    expertData?: any;
}

const THIRAN_LOGO = require('../assets/images/thiran360ai_logo.png');

export const PORTFOLIO_SEARCH_MAP: PortfolioMatch[] = [
    // ──── Skyline Sub-Service Deep-Links ──────────────────────────────────
    // These entries appear BEFORE the generic SkylinePortfolio entry so they
    // score higher for specific service queries and navigate directly to the
    // detail screen with the correct serviceId.
    {
        screen: 'SkylineServiceDetail',
        serviceId: 4,
        name: 'Skyline - Roofing & Fabrication',
        name_ta: 'ஸ்கைலைன் - கூரை & தயாரிப்பு',
        description: 'Metal Roofing, Shed & Fabrication Works',
        description_ta: 'மெட்டல் கூரை, ஷெட் வேலை',
        icon: 'factory',
        color: '#1E293B',
        bg: '#F1F5F9',
        image: 'https://i.pinimg.com/1200x/a0/31/d7/a031d70fd353890dd941d7a0694c8f6f.jpg',
        keywords: [
            // English
            'roofing', 'roof', 'shed', 'metal roof', 'metal roofing', 'fabrication',
            'factory shed', 'industrial shed', 'parking shade', 'car shade',
            'terrace roofing', 'roof sheet', 'pvc roof', 'polycarbonate',
            'iron sheet', 'steel roofing', 'warehouse shed', 'roofing work',
            'rooftop', 'shed construction', 'zinc sheet',
            // Thanglish
            'roof venum', 'shed venum', 'roofing pannunga', 'madi koorai venum',
            'shed podu', 'parking shade venum', 'koorai velai venum',
            // Tamil
            'கூரை', 'ஷெட்', 'மெட்டல் கூரை', 'மேல்கூரை', 'வேலி',
            'தொழிற்சாலை ஷெட்', 'கூரை வேலை', 'ஷீட் பொருத்தத்தல்',
        ],
    },
    {
        screen: 'SkylineServiceDetail',
        serviceId: 2,
        name: 'Skyline - Renovation & Interiors',
        name_ta: 'ஸ்கைலைன் - புதுப்பித்தல் & உள்ளகட்டமைப்பு',
        description: 'Home & Office Renovation, Interior Design',
        description_ta: 'வீடு புதுப்பித்தல், உள்ளகட்டமைப்பு',
        icon: 'home-edit',
        color: '#0891B2',
        bg: '#ECFEFF',
        image: 'https://image.pollinations.ai/prompt/modern-living-room-interior-design-luxury-renovation-high-quality?width=800&height=600&nologo=true',
        keywords: [
            // English
            'renovation', 'renovate', 'interior', 'interior design', 'remodeling',
            'home renovation', 'room renovation', 'office renovation',
            'bathroom renovation', 'kitchen renovation', 'home interior',
            'false ceiling', 'pop ceiling', 'gypsum ceiling', 'paint work',
            'wall design', 'tile work', 'bathroom tiles', 'wall tiles',
            'home design', 'house renovation', 'flat renovation',
            // Thanglish
            'renovation pannunga', 'interior design venum', 'room design venum',
            'house renovate pannunga', 'bathroom tile venum', 'false ceiling venum',
            // Tamil
            'புதுப்பித்தல்', 'உள்ளகட்டமைப்பு', 'வீடு புனரமைப்பு',
            'அறை வடிவமைப்பு', 'குளியலறை புதுப்பித்தல்',
        ],
    },
    {
        screen: 'SkylineServiceDetail',
        serviceId: 3,
        name: 'Skyline - Modular Kitchen',
        name_ta: 'ஸ்கைலைன் - மாடுலர் சமையலறை',
        description: 'Custom Modular Kitchen & Wardrobe Design',
        description_ta: 'மாடுலர் சமையலறை & அலமாரி',
        icon: 'countertop',
        color: '#4F46E5',
        bg: '#EEF2FF',
        image: 'https://i.pinimg.com/736x/fd/20/3f/fd203f1430afb0e89d5588636020d39b.jpg',
        keywords: [
            // English
            'modular kitchen', 'modular', 'kitchen', 'wardrobe', 'tv unit',
            'kitchen cabinet', 'kitchen design', 'kitchen renovation',
            'kitchen shelf', 'kitchen counter', 'countertop', 'cabinet',
            'built-in wardrobe', 'sliding wardrobe', 'kitchen interior',
            'kitchen setup', 'custom kitchen', 'loft storage',
            // Thanglish
            'modular kitchen venum', 'kitchen venum', 'kitchen design pannunga',
            'wardrobe venum', 'kitchen shelf venum', 'kitchen cabinet venum',
            // Tamil
            'மாடுலர் சமையலறை', 'சமையலறை', 'அலமாரி', 'சமையலறை வடிவமைப்பு',
            'சமையலறை மாற்றம்', 'பெட்டி சமையலறை',
        ],
    },
    {
        screen: 'SkylineServiceDetail',
        serviceId: 1,
        name: 'Skyline - Construction',
        name_ta: 'ஸ்கைலைன் - கட்டிட நிர்மாணம்',
        description: 'New Building, Civil & House Construction',
        description_ta: 'புதிய கட்டிடம், சிவில் நிர்மாணம்',
        icon: 'office-building',
        color: '#2563EB',
        bg: '#EFF6FF',
        image: 'https://i.pinimg.com/736x/c8/60/d8/c860d8caaffe8061fd0fd3b5e9bb727d.jpg',
        keywords: [
            // English
            'construction', 'build', 'building', 'new building', 'house construction',
            'civil', 'civil work', 'contractor', 'architect', 'architecture',
            'compound wall', 'porch', 'staircase', 'railing', 'elevation',
            'cement work', 'concrete', 'foundation', 'column', 'beam',
            'residential construction', 'commercial construction', 'flat construction',
            // Thanglish
            'veedu katta venum', 'construction venum', 'building venum',
            'civil work venum', 'house build pannunga', 'new house venum',
            // Tamil
            'à®•à®Ÿà¯à®Ÿà®¿à®Ÿ à®¨à®¿à®°à¯à®®à®¾à®£à®®à¯', 'à®ªà¯à®¤à®¿à®¯ à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®®à¯', 'à®µà¯€à®Ÿà¯ à®•à®Ÿà¯à®Ÿà¯à®¤à®²à¯',
            'à®šà®¿à®µà®¿à®²à¯ à®µà¯‡à®²à¯ˆ', 'à®•à®Ÿà¯à®Ÿà¯à®®à®¾à®©à®®à¯', 'à®¨à®¿à®°à¯à®®à®¾à®£à®®à¯',
        ],
    },
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    
    {
        screen: 'SkylinePortfolio',
        name: 'Skyline Builders',
        name_ta: 'à®¸à¯à®•à¯ˆà®²à¯ˆà®©à¯ à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®•à¯à®•à®²à¯ˆ',
        description: 'Construction, Interior & Renovation Services',
        description_ta: 'à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®®à¯, à®‰à®³à¯à®•à®Ÿà¯à®Ÿà®®à¯ˆà®ªà¯à®ªà¯',
        icon: 'office-building',
        color: '#2563EB',
        bg: '#EFF6FF',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop',
        keywords: [
            // English
            'construction', 'build', 'building', 'interior', 'renovation',
            'modular', 'kitchen', 'wardrobe', 'painting', 'paint', 'roofing',
            'roof', 'shed', 'fabrication', 'skyline', 'architect', 'architecture',
            'contractor', 'civil', 'house construction', 'new building',
            'remodeling', 'home interior', 'builders', 'false ceiling', 'pop ceiling',
            'gypsum', 'cement work', 'tile work', 'room renovation', 'bathroom renovation',
            'kitchen renovation', 'glass work', 'elevation', 'compound wall',
            'porch', 'parking shade', 'terrace work', 'staircase', 'railing',
            'interior design', 'modular kitchen', 'tv unit',
            // Thanglish
            'veedu katta venum', 'construction venum', 'interior design venum',
            'renovation pannunga', 'skyline kita po', 'kitchen modular venum',
            'false ceiling venum', 'paint pannunga', 'civil work venum',
            'bathroom tile venum', 'room design venum',
            // Tamil
            'à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®®à¯', 'à®¨à®¿à®°à¯à®®à®¾à®£à®®à¯', 'à®‰à®³à¯à®•à®Ÿà¯à®Ÿà®®à¯ˆà®ªà¯à®ªà¯', 'à®ªà¯à®¤à¯à®®à¯ˆ',
            'à®®à®¾à®Ÿà¯à®²à®°à¯', 'à®šà®®à¯ˆà®¯à®²à®±à¯ˆ', 'à®…à®²à®®à®¾à®°à®¿', 'à®µà®£à¯à®£à®®à¯', 'à®•à¯‚à®°à¯ˆ',
            'à®¸à¯à®•à¯ˆà®²à¯ˆà®©à¯', 'à®•à®Ÿà¯à®Ÿà®¿à®Ÿ à®µà®²à¯à®²à¯à®¨à®°à¯', 'à®•à®Ÿà¯à®Ÿà¯à®®à®¾à®©à®®à¯', 'à®µà¯€à®Ÿà¯',
            'à®ªà¯à®¤à¯à®ªà¯à®ªà®¿à®¤à¯à®¤à®²à¯', 'à®µà®Ÿà®¿à®µà®®à¯ˆà®ªà¯à®ªà¯',
        ],
    },
    {
        screen: 'SpokenHindiPortfolio',
        name: 'Raanuva Veeran Academy',
        name_ta: 'à®°à®¾à®£à¯à®µ à®µà¯€à®°à®©à¯ à®…à®•à®¾à®Ÿà®®à®¿',
        description: 'Spoken Hindi Classes & Language Training',
        description_ta: 'à®‡à®¨à¯à®¤à®¿ à®µà®•à¯à®ªà¯à®ªà¯, à®®à¯Šà®´à®¿ à®ªà®¯à®¿à®±à¯à®šà®¿',
        icon: 'microphone-variant',
        color: '#0EA5E9',
        bg: '#F0F9FF',
        image: 'https://www.raanuvaveeranspokenhindiacademy.com/indian-flag.jpg',
        keywords: [
            // English
            'hindi', 'hindi class', 'language', 'spoken hindi', 'learn hindi',
            'corporate hindi', 'certification', 'language training', 'academy',
            'raanuva', 'veeran', 'spoken language', 'north india language',
            'hindi course', 'hindi speaking', 'hindi for job', 'hindi teacher',
            'hindi tutor', 'hindi coaching', 'basic hindi', 'advanced hindi',
            // Thanglish
            'hindi karka venum', 'hindi class venum', 'hindi padikka venum',
            'language class venum', 'hindi teacher venum', 'spoken hindi class',
            'raanuva kita po', 'hindi certificate venum', 'vada mozhi class',
            // Tamil
            'à®‡à®¨à¯à®¤à®¿', 'à®®à¯Šà®´à®¿', 'à®‡à®¨à¯à®¤à®¿ à®µà®•à¯à®ªà¯à®ªà¯', 'à®•à®±à¯à®•', 'à®…à®•à®¾à®Ÿà®®à®¿',
            'à®®à¯Šà®´à®¿ à®ªà®¯à®¿à®±à¯à®šà®¿', 'à®šà®¾à®©à¯à®±à®¿à®¤à®´à¯', 'à®µà®Ÿà®®à¯Šà®´à®¿', 'à®ªà¯‡à®šà¯à®šà¯ à®‡à®¨à¯à®¤à®¿',
        ],
    },
    {
        screen: 'WoodZonePortfolio',
        name: 'Wood Zone Tiles & Furniture',
        name_ta: 'à®µà¯à®Ÿà¯ à®œà¯‹à®©à¯ à®Ÿà¯ˆà®²à¯à®¸à¯ à®¤à®³à®ªà®¾à®Ÿà®®à¯',
        description: 'Tiles, Furniture & Interior DÃ©cor',
        description_ta: 'à®Ÿà¯ˆà®²à¯à®¸à¯, à®¤à®³à®ªà®¾à®Ÿà®®à¯, à®‰à®³à¯à®•à®¾à®Ÿà¯à®šà®¿',
        icon: 'floor-plan',
        color: '#D97706',
        bg: '#FFFBEB',
        image: require('../assets/images/skyline_modular_4.png'),
        keywords: [
            // English
            'tiles', 'tile', 'floor tiles', 'wall tiles', 'furniture', 'wood',
            'wooden', 'wardrobe', 'sofa', 'bed', 'interior decor', 'decor',
            'wood zone', 'woodzone', 'flooring', 'modular furniture',
            'ceramic', 'granite', 'marble', 'closet', 'cupboard', 'table',
            'chair', 'plywood', 'bathroom tiles', 'kitchen tiles', 'vitrified tiles',
            'anti-skid tiles', 'parking tiles', 'teakwood', 'mdf', 'laminate',
            'dressing table', 'tv stand', 'shoe rack', 'book shelf', 'kids furniture',
            'office furniture', 'bed frame', 'cot', 'dining table', 'dining set',
            'center table', 'modular kitchen',
            // Thanglish
            'tiles venum', 'floor tile venum', 'furniture venum', 'sofa venum',
            'wood zone kita po', 'cot venum', 'dining table venum',
            'tiles podunga', 'granite tiles venum', 'teak furniture venum',
            // Tamil
            'à®Ÿà¯ˆà®²à¯à®¸à¯', 'à®¤à®³à®ªà®¾à®Ÿà®®à¯', 'à®®à®°à®®à¯', 'à®¤à®°à¯ˆ', 'à®šà¯à®µà®°à¯ à®Ÿà¯ˆà®²à¯à®¸à¯',
            'à®‰à®³à¯à®•à®¾à®Ÿà¯à®šà®¿', 'à®µà¯à®Ÿà¯ à®œà¯‹à®©à¯', 'à®šà¯‹à®ƒà®ªà®¾', 'à®ªà®Ÿà¯à®•à¯à®•à¯ˆ', 'à®®à®°à®µà¯‡à®²à¯ˆ',
            'à®ªà¯€à®°à¯‹', 'à®¨à®¾à®±à¯à®•à®¾à®²à®¿', 'à®®à¯‡à®œà¯ˆ', 'à®•à®Ÿà¯à®Ÿà®¿à®²à¯', 'à®•à®¿à®°à®¾à®©à¯ˆà®Ÿà¯',
        ],
    },
    
    

    {
        screen: 'Thiran360AIPortfolio',
        name: 'THIRAN360AI',
        name_ta: 'THIRAN360AI',
        description: 'IT, Software & App Development',
        description_ta: 'IT, à®®à¯†à®©à¯à®ªà¯Šà®°à¯à®³à¯ & à®†à®ªà¯ à®®à¯‡à®®à¯à®ªà®¾à®Ÿà¯',
        icon: 'robot',
        color: '#14B8A6',
        bg: '#F0FDFA',
        image: THIRAN_LOGO,
        keywords: [
            // English
            'it', 'software', 'app', 'application', 'webapp', 'website', 'web',
            'development', 'developer', 'coding', 'programming', 'thiran',
            'thiran360ai', 'it solution', 'software solution', 'app development',
            'website design', 'web development', 'manickavasagar', 'it consulting',
            'digital transformation', 'cloud', 'mobile app', 'ios', 'android',
            'react native', 'flutter', 'nextjs', 'react', 'erp', 'crm',
            // Thanglish
            'it company', 'software company', 'app panna venum', 'website venum',
            'website pannunga', 'it solution venum', 'thiran kita po',
            'app developer venum', 'software pannunga',
            // Tamil
            'à®à®Ÿà®¿', 'à®®à¯†à®©à¯à®ªà¯Šà®°à¯à®³à¯', 'à®†à®ªà¯', 'à®µà®¿à®£à¯à®£à®ªà¯à®ªà®®à¯', 'à®µà®²à¯ˆà®¤à¯à®¤à®³à®®à¯',
            'à®®à¯‡à®®à¯à®ªà®¾à®Ÿà¯', 'à®Ÿà¯†à®µà®²à®ªà¯à®ªà®°à¯', 'à®¤à®¿à®±à®©à¯', 'à®®à®¾à®£à®¿à®•à¯à®•à®µà®¾à®šà®•à®°à¯',
            'à®µà®²à¯ˆà®¤à®³ à®µà®Ÿà®¿à®µà®®à¯ˆà®ªà¯à®ªà¯', 'à®®à¯†à®©à¯à®ªà¯Šà®°à¯à®³à¯ à®¤à¯€à®°à¯à®µà¯',
        ],
    },
    {
        screen: 'SwarajTractorPortfolio',
        name: 'Saaral Motors',
        name_ta: 'à®šà®¾à®°à®²à¯ à®®à¯‹à®Ÿà¯à®Ÿà®¾à®°à¯à®¸à¯',
        description: 'Tractor Sales, Service & Spare Parts',
        description_ta: 'à®Ÿà®¿à®°à®¾à®•à¯à®Ÿà®°à¯ à®µà®¿à®±à¯à®ªà®©à¯ˆ à®®à®±à¯à®±à¯à®®à¯ à®šà®°à¯à®µà¯€à®¸à¯',
        icon: 'tractor',
        color: '#EF4444',
        bg: '#FEF2F2',
        image: require('../assets/images/portfolio/swaraj/hero.jpg'),
        keywords: [
            // English
            'tractor', 'tractors', 'swaraj', 'saaral motors', 'saaral', 'motors',
            'farming', 'agriculture', 'plough', 'harvester', 'spare parts',
            'tractor service', 'tractor repair', 'tractor sales', 'swaraj showroom',
            '735 fe', '744 xt', '855 fe', '963 fe', '969 fe', '4wd tractor',
            'saravanan', 'gobi tractors', 'gobichettipalayam tractors',
            // Thanglish
            'tractor venum', 'swaraj tractor venum', 'tractor repair pannunga',
            'saravanan kita po', 'vivasaya vandi', 'tractor showroom enga iruku',
            'saaral motors kita po',
            // Tamil
            'à®Ÿà®¿à®°à®¾à®•à¯à®Ÿà®°à¯', 'à®šà¯à®µà®°à®¾à®œà¯', 'à®šà®¾à®°à®²à¯ à®®à¯‹à®Ÿà¯à®Ÿà®¾à®°à¯à®¸à¯', 'à®µà®¿à®µà®šà®¾à®¯à®®à¯',
            'à®‰à®¤à®¿à®°à®¿à®ªà®¾à®•à®™à¯à®•à®³à¯', 'à®µà®¿à®±à¯à®ªà®©à¯ˆ', 'à®šà®°à¯à®µà¯€à®¸à¯', 'à®šà®°à®µà®£à®©à¯',
        ],
    },
    {
        screen: 'SunPowerPortfolio',
        name: 'Mega Sun Power Equipments',
        name_ta: 'à®šà®©à¯ à®ªà®µà®°à¯ à®Žà®•à¯à®µà®¿à®ªà¯à®®à¯†à®£à¯à®Ÿà¯à®¸à¯',
        description: 'Solar, UPS & R.O Systems',
        description_ta: 'à®šà¯‹à®²à®¾à®°à¯, UPS à®®à®±à¯à®±à¯à®®à¯ à®µà®¾à®Ÿà¯à®Ÿà®°à¯ RO à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯',
        icon: 'solar-power',
        color: '#D97706',
        bg: '#FEF3C7',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        keywords: [
            // English
            'solar', 'solar panel', 'solar system', 'solar pumps', 'solar street light', 'ongrid solar', 'offgrid solar',
            'ups', 'battery', 'inverter', 'water purifier', 'ro', 'ro system', 'ro water', 'water filter',
            'purifier service', 'prabakaran', 'sun power', 'equipments',
            // Thanglish
            'solar set pannanum', 'solar panel price', 'solar pump set', 'water filter service', 'ro water purifier repair',
            'ups battery change', 'inverter battery', 'kavindapadi solar shop', 'prabakaran sun power',
            // Tamil
            'à®šà¯‹à®²à®¾à®°à¯', 'à®šà¯‹à®²à®¾à®°à¯ à®ªà¯‡à®©à®²à¯', 'à®šà¯‹à®²à®¾à®°à¯ à®ªà®®à¯à®ªà¯', 'à®šà¯‹à®²à®¾à®°à¯ à®¤à¯†à®°à¯ à®µà®¿à®³à®•à¯à®•à¯', 'à®®à®¿à®©à¯ à®šà¯à®¤à¯à®¤à®¿à®•à®°à®¿à®ªà¯à®ªà¯', 'à®µà®¾à®Ÿà¯à®Ÿà®°à¯ à®ªà®¿à®¯à¯‚à®°à®¿à®ƒà®ªà¯ˆà®¯à®°à¯',
            'à®ªà¯‡à®Ÿà¯à®Ÿà®°à®¿', 'à®‡à®©à¯à®µà¯†à®°à¯à®Ÿà¯à®Ÿà®°à¯', 'à®•à®µà¦¿à¦¨à§à¦¦à®ªà®¾à®Ÿà®¿', 'à®ªà®¿à®°à®ªà®¾à®•à®°à®©à¯', 'à®šà®©à¯ à®ªà®µà®°à¯',
        ],
    },
    {
        screen: 'ManojSteelsPortfolio',
        name: 'Manojsteels',
        name_ta: 'à®®à®©à¯‹à®œà¯ à®¸à¯à®Ÿà¯€à®²à¯à®¸à¯',
        description: 'Cement, TMT Bars & Building Blocks',
        description_ta: 'à®šà®¿à®®à¯†à®£à¯à®Ÿà¯, à®Ÿà®¿à®Žà®®à¯à®Ÿà®¿ à®•à®®à¯à®ªà®¿à®•à®³à¯ & à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®ªà¯ à®ªà¯Šà®°à¯à®Ÿà¯à®•à®³à¯',
        icon: 'warehouse',
        color: '#B45309',
        bg: '#FEF3C7',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
        keywords: [
            // English
            'cement', 'tmt bars', 'steel bars', 'building materials', 'building blocks', 'solid blocks', 'hollow blocks',
            'blue metal', 'aggregates', 'm-sand', 'p-sand', 'sand', 'construction materials', 'manojsteels', 'manoj', 'manojkumar', 'anandhan',
            // Thanglish
            'cement venum', 'kambi price', 'steel kambi', 'tmt kambi', 'jalli', 'blue metal jalli', 'sengal', 'building blocks',
            'm sand price', 'p sand price', 'manoj steels gobichettipalayam', 'tn palayam shop',
            // Tamil
            'à®šà®¿à®®à¯†à®£à¯à®Ÿà¯', 'à®Ÿà®¿à®Žà®®à¯à®Ÿà®¿ à®•à®®à¯à®ªà®¿à®•à®³à¯', 'à®•à®®à¯à®ªà®¿', 'à®‡à®°à¯à®®à¯à®ªà¯ à®•à®®à¯à®ªà®¿', 'à®•à®Ÿà¯à®Ÿà®¿à®Ÿ à®ªà¯Šà®°à¯à®Ÿà¯à®•à®³à¯', 'à®œà®²à¯à®²à®¿', 'à®•à®²à¯', 'à®ªà®¿à®³à®¾à®•à¯',
            'à®®à®£à®²à¯', 'à®Žà®®à¯ à®šà®¾à®£à¯à®Ÿà¯', 'à®ªà®¿ à®šà®¾à®£à¯à®Ÿà¯', 'à®®à®©à¯‹à®œà¯ à®¸à¯à®Ÿà¯€à®²à¯à®¸à¯', 'à®®à®©à¯‹à®œà¯à®•à¯à®®à®¾à®°à¯', 'à®†à®©à®¨à¯à®¤à®©à¯',
        ],
    },
    {
        screen: 'STGEsportsPortfolio',
        name: 'STG Esports',
        name_ta: 'STG Esports',
        description: 'BGMI Tournaments & Matches',
        description_ta: 'BGMI à®ªà¯‹à®Ÿà¯à®Ÿà®¿à®•à®³à¯',
        icon: 'gamepad-variant',
        color: '#EF4444',
        bg: '#FEF2F2',
        image: 'https://i.pinimg.com/736x/aa/97/26/aa9726ec3cd7460f4d6aa428d07eb500.jpg',
        keywords: [
            'stg', 'esports', 'bgmi', 'tournament', 'tournaments', 'gaming', 'matches', 'stg esports'
        ]
    },
    {
        screen: 'MejesticStudioPortfolio',
        name: 'Mejestic Studio',
        name_ta: 'à®®à¯†à®œà®¸à¯à®Ÿà®¿à®•à¯ à®¸à¯à®Ÿà¯à®Ÿà®¿à®¯à¯‹',
        description: 'Wedding Photography, Cinematic Shoots & Portraits',
        description_ta: 'à®¤à®¿à®°à¯à®®à®£ à®ªà¯à®•à¯ˆà®ªà¯à®ªà®Ÿà®®à¯ à®®à®±à¯à®±à¯à®®à¯ à®¨à¯‡à®°à¯à®¤à¯à®¤à®¿à®¯à®¾à®© à®ªà¯‹à®Ÿà¯à®Ÿà¯‹à®·à¯‚à®Ÿà¯',
        icon: 'camera-iris',
        color: '#FFB300',
        bg: '#1E1B4B',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
        keywords: [
            // English
            'studio', 'photo studio', 'photography', 'photographer', 'wedding photography',
            'wedding photoshoot', 'candid photography', 'photoshoot', 'passport photo',
            'baby shoot', 'portrait', 'camera', 'camera room', 'majestic', 'mejestic', 'arun',
            // Thanglish
            'studio venum', 'photo edukanum', 'wedding photoshoot venum', 'photoshoot pannunga',
            'camera man venum', 'arun camera',
            // Tamil
            'à®¸à¯à®Ÿà¯à®Ÿà®¿à®¯à¯‹', 'à®ªà¯‹à®Ÿà¯à®Ÿà¯‹', 'à®ªà¯à®•à¯ˆà®ªà¯à®ªà®Ÿà®®à¯', 'à®ªà¯à®•à¯ˆà®ªà¯à®ªà®Ÿ à®•à®²à¯ˆà®žà®°à¯', 'à®¤à®¿à®°à¯à®®à®£ à®ªà¯‹à®Ÿà¯à®Ÿà¯‹',
            'à®ªà¯‹à®Ÿà¯à®Ÿà¯‹à®·à¯‚à®Ÿà¯', 'à®•à¯‡à®®à®°à®¾', 'à®…à®°à¯à®£à¯',
        ],
    },
    {
        screen: 'SakthiElectricalsPortfolio',
        name: 'Sri Sakthi Team',
        name_ta: 'à®¸à¯à®°à¯€ à®šà®•à¯à®¤à®¿ à®Ÿà¯€à®®à¯',
        description: 'Electrical & Electronics Expert',
        description_ta: 'à®Žà®²à®•à¯à®Ÿà¯à®°à®¿à®•à¯à®•à®²à¯ & à®Žà®²à®•à¯à®Ÿà¯à®°à®¾à®©à®¿à®•à¯à®¸à¯ à®¨à®¿à®ªà¯à®£à®°à¯',
        icon: 'flash',
        color: '#EAB308',
        bg: '#FEF9C3',
        image: require('../assets/images/sakthi_hero.png'),
        keywords: [
            // English
            'electrical', 'electricals', 'electronics', 'repair', 'service', 'smart auto',
            'sakthi', 'sakthi electrical', 'sri sakthi team', 'wiring', 'motor repair', '3d printing', '3d printer',
            // Thanglish
            'electrical work', 'wiring venum', 'motor repair pannanum', 'sakthi electricals',
            // Tamil
            'à®Žà®²à®•à¯à®Ÿà¯à®°à®¿à®•à¯à®•à®²à¯', 'à®Žà®²à®•à¯à®Ÿà¯à®°à®¾à®©à®¿à®•à¯à®¸à¯', 'à®°à®¿à®ªà¯à®ªà¯‡à®°à¯', 'à®šà®°à¯à®µà¯€à®¸à¯', 'à®šà®•à¯à®¤à®¿', 'à®®à¯‹à®Ÿà¯à®Ÿà®¾à®°à¯',
        ],
    },
    {
        screen: 'GanagatharaPortfolio',
        name: 'Sri Ganagathara Agency',
        name_ta: 'à®¸à¯à®°à¯€ à®•à®©à®•à®¤à®¾à®°à®¾ à®à®œà¯†à®©à¯à®šà®¿',
        description: 'Electricals & Hardwares',
        description_ta: 'à®Žà®²à®•à¯à®Ÿà¯à®°à®¿à®•à¯à®•à®²à¯à®¸à¯ à®®à®±à¯à®±à¯à®®à¯ à®¹à®¾à®°à¯à®Ÿà¯à®µà¯‡à®°à¯à®¸à¯',
        icon: 'power-plug',
        color: '#EAB308',
        bg: '#FEF08A',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop',
        keywords: [
            // English
            'electricals', 'electrical', 'hardwares', 'hardware', 'wire', 'cable', 'switch',
            'pipe', 'fittings', 'taps', 'philips', 'kundan', 'gm', 'watertec', 'truflo',
            'hindware', 'senthilkumar', 'ganagathara', 'agency', 'gobi', 'electrical shop', 'hardware shop',
            // Thanglish
            'electrical shop', 'hardware shop', 'wire venum', 'switch venum', 'pipe venum',
            'tap venum', 'motor pipe', 'ganagathara agency',
            // Tamil
            'à®Žà®²à®•à¯à®Ÿà¯à®°à®¿à®•à¯à®•à®²à¯à®¸à¯', 'à®¹à®¾à®°à¯à®Ÿà¯à®µà¯‡à®°à¯à®¸à¯', 'à®µà®¯à®°à¯', 'à®šà¯à®µà®¿à®Ÿà¯à®šà¯', 'à®ªà¯ˆà®ªà¯', 'à®•à®©à¯†à®•à¯â€Œà®·à®©à¯', 'à®à®œà¯†à®©à¯à®šà®¿',
        ],
    },
    {
        screen: 'GVBuildtechPortfolio',
        name: 'GV BuildTech Solutions Builders & Interiors',
        name_ta: 'GV à®ªà®¿à®²à¯à®Ÿà¯†à®•à¯ à®ªà®¿à®²à¯à®Ÿà®°à¯à®¸à¯ & à®‡à®©à¯à®Ÿà¯€à®°à®¿à®¯à®°à¯à®¸à¯',
        description: 'Construction & Interiors',
        description_ta: 'à®•à®Ÿà¯à®Ÿà¯à®®à®¾à®©à®®à¯ & à®‰à®³à¯à®•à®¾à®Ÿà¯à®šà®¿',
        icon: 'office-building',
        color: '#2563EB',
        bg: '#EFF6FF',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
        keywords: [
            'fabrication', 'upvc', 'net', 'window', 'door', 'à®œà®©à¯à®©à®²à¯', 'à®µà®²à¯ˆ', 'à®•à®¤à®µà¯', 'à®šà®¾à®³à®°à®®à¯',
            'jannal', 'valai', 'kathavu', 'kadhavu', 'kannadi jannal', 'saalaram', 'upvc window',
            'mosquito net', 'kosu valai', 'grill gate', 'irumbu kadhavu', 'fabricasan',
            'gv', 'gv buildtech', 'gv builtech'
        ],
    },
    {
        screen: 'SriJeyamPortfolio',
        name: 'Sri Jayam Glass House',
        name_ta: 'à®¸à¯à®°à¯€ à®œà¯†à®¯à®®à¯ à®•à®¿à®³à®¾à®¸à¯ à®¹à®µà¯à®¸à¯',
        description: 'UPVC, PVC & Glass Works',
        description_ta: 'UPVC, PVC à®®à®±à¯à®±à¯à®®à¯ à®•à®£à¯à®£à®¾à®Ÿà®¿ à®µà¯‡à®²à¯ˆà®•à®³à¯',
        icon: 'window-closed-variant',
        color: '#0EA5E9',
        bg: '#E0F2FE',
        image: require('../assets/images/portfolio/srijeyam/hero.png'),
        keywords: [
            'glass', 'glass house', 'upvc', 'pvc', 'cupboard', 'window', 'door', 'membrane door',
            'false ceiling', 'ceiling', 'grid ceiling', 'aluminum', 'partition', 'prakash',
            'jayam', 'sri jayam', 'glass door', 'coloring glass', 'interior', 'pvc door',
            'glass work', 'aluminum partition', 'upvc window venum', 'pvc door venum',
            'glass door venum', 'ceiling work', 'à®•à®£à¯à®£à®¾à®Ÿà®¿', 'à®•à®¤à®µà¯', 'à®œà®©à¯à®©à®²à¯', 'à®šà¯€à®²à®¿à®™à¯'
        ],
    },
    {
        screen: 'AbiramiPortfolio',
        name: 'Sri Abirami Book Binding',
        name_ta: 'à®¸à¯à®°à¯€ à®…à®ªà®¿à®°à®¾à®®à®¿ à®ªà¯à®•à¯ à®ªà¯ˆà®£à¯à®Ÿà®¿à®™à¯',
        description: 'Book Binding & Stationery Printing',
        description_ta: 'à®ªà¯à®•à¯ à®ªà¯ˆà®£à¯à®Ÿà®¿à®™à¯ à®®à®±à¯à®±à¯à®®à¯ à®¸à¯à®Ÿà¯‡à®·à®©à®°à®¿ à®…à®šà¯à®šà¯',
        icon: 'book-open-page-variant',
        color: '#7C3AED',
        bg: '#F5F3FF',
        image: require('../assets/images/portfolio/abirami/hero.png'),
        keywords: [
            'prabhu', 'manikandan', 'r prabhu', 'abirami', 'sri abirami', 'book binding', 'binding',
            'stationeries', 'stationery', 'note books', 'notebooks', 'bill book', 'calendar', 'notice',
            'printed books', 'book store', 'calendar printing', 'notice printing',
            // Tamil phonetic
            'puthagam', 'notu', 'calendar', 'stationery', 'bill book'
        ]
    },
];

/**
 * Find portfolio matches from voice input text.
 * Returns scored matches, best match first.
 * For generic queries ("service", "all", etc.), returns ALL portfolios.
 */
export function findPortfolioMatches(transcript: string): PortfolioMatch[] {
    const lower = transcript.toLowerCase().trim();

    // Generic / broad queries â†’ return ALL portfolios
    const GENERIC_EXACT = [
        'service', 'services', 'all', 'everything', 'list all', 'experts', 'all experts',
        'yellam', 'all portfolios', 'who are you', 'à®Žà®²à¯à®²à®¾à®®à¯', 'à®šà¯‡à®µà¯ˆ', 'à®šà¯‡à®µà¯ˆà®•à®³à¯'
    ];
    const GENERIC_PHRASES = [
        'show all', 'show services', 'available services', 'our services',
        'what do you offer', 'what services', 'yellam portfolios'
    ];

    const isGeneric = GENERIC_EXACT.some(term => lower === term) || 
                      GENERIC_PHRASES.some(phrase => lower.includes(phrase));
    
    if (isGeneric) {
        return [...PORTFOLIO_SEARCH_MAP]; // return all, in original order
    }

    const words = lower.split(/\s+/);
    const scores: Map<string, number> = new Map();

    PORTFOLIO_SEARCH_MAP.forEach((portfolio) => {
        let score = 0;
        portfolio.keywords.forEach((keyword) => {
            const kLower = keyword.toLowerCase();

            // 1. Exact phrase boost
            if (lower === kLower) {
                score += 30; // Massive boost for exact match
            } else if (lower.includes(kLower)) {
                score += kLower.includes(' ') ? 15 : 8;
            }

            // Individual word matches
            words.forEach((word) => {
                if (kLower === word) {
                    score += 12; // High points for exact word match
                } else if (word.length >= 4 && (kLower.includes(word) || word.includes(kLower))) {
                    // Only allow partial matches for words with 4+ characters
                    score += 4;
                }
            });
        });
        if (score > 0) {
            // Exclude Abirami (Book Binding/Printing press) from '3d printing' searches
            if (portfolio.screen === 'AbiramiPortfolio' && (lower.includes('3d') || lower.includes('3 d'))) {
                score = 0;
            }
        }
        if (score > 0) {
            scores.set(portfolio.screen, score);
        }
    });

    // --- Secondary Pass: Search across SERVICE_KEYWORDS for broad categories ---
    Object.entries(SERVICE_KEYWORDS).forEach(([category, keywords]) => {
        let serviceScore = 0;
        (keywords as string[]).forEach(k => {
            const kLower = k.toLowerCase();
            if (lower === kLower) {
                serviceScore += 25;
            } else if (lower.includes(kLower)) {
                serviceScore += kLower.includes(' ') ? 12 : 6;
            }
            words.forEach(word => {
                if (kLower === word) serviceScore += 8;
                else if (word.length >= 4 && (kLower.includes(word) || word.includes(kLower))) {
                    serviceScore += 2;
                }
            });
        });

        if (serviceScore > 0) {
            const mapping: Record<string, string | string[]> = {
                'roofing': 'SkylinePortfolio',
                'hindi': 'SpokenHindiPortfolio',
                'tiles_furn': 'WoodZonePortfolio',
                'carpentry': 'WoodZonePortfolio',

                'swaraj': 'SwarajTractorPortfolio',
                'solar_power': 'SunPowerPortfolio',
                'photography': 'MejesticStudioPortfolio',
                'it_software': 'Thiran360AIPortfolio',
                'upvc_nets': 'GVBuildtechPortfolio',
                'electrical': ['GanagatharaPortfolio', 'SakthiElectricalsPortfolio'],
                '3d_printing': 'SakthiElectricalsPortfolio',
                'painting': 'SkylinePortfolio',
            };

            const targetScreens = mapping[category];
            if (targetScreens) {
                const screens = Array.isArray(targetScreens) ? targetScreens : [targetScreens];
                screens.forEach(screen => {
                    const existingScore = scores.get(screen) ?? 0;
                    scores.set(screen, existingScore + serviceScore);
                });
            } else {
                const syntheticKey = `SERVICE_${category}`;
                if (!scores.has(syntheticKey)) {
                    const syntheticMatch: PortfolioMatch = {
                        screen: 'Experts',
                        name: category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        name_ta: category === 'plumbing' ? 'à®ªà®¿à®³à®®à¯à®ªà®¿à®™à¯' : 
                                 category === 'electrical' ? 'à®Žà®²à®•à¯à®Ÿà¯à®°à®¿à®•à¯à®•à®²à¯' : 
                                 category === 'cleaning' ? 'à®šà¯à®¤à¯à®¤à®®à¯' : 
                                 category === 'painting' ? 'à®ªà¯†à®¯à®¿à®£à¯à®Ÿà®¿à®™à¯' : 
                                 category === 'ac_repair' ? 'à®à®šà®¿ à®ªà®´à¯à®¤à¯' : 'à®šà¯‡à®µà¯ˆ',
                        description: `Specialists in ${category.replace('_', ' ')}`,
                        description_ta: 'à®¨à®¿à®ªà¯à®£à®¤à¯à®¤à¯à®µ à®šà¯‡à®µà¯ˆà®•à®³à¯',
                        icon: category === 'plumbing' ? 'pipe' : 
                              category === 'electrical' ? 'flash' : 
                              category === 'cleaning' ? 'broom' : 
                              category === 'painting' ? 'format-paint' : 'tools',
                        color: '#6366F1',
                        bg: '#EEF2FF',
                        image: 'https://images.unsplash.com/photo-1581244276891-6bc61ef0023d?q=80&w=400&auto=format&fit=crop',
                        keywords: keywords as string[],
                        category: category // Store the internal key (e.g. 'plumbing')
                    };
                    
                    (findPortfolioMatches as any).syntheticMatches = (findPortfolioMatches as any).syntheticMatches || [];
                    (findPortfolioMatches as any).syntheticMatches.push({ match: syntheticMatch, score: serviceScore });
                    scores.set(syntheticKey, serviceScore);
                }
            }
        }
    });

    // --- Third Pass: Search across EXPERT_KEYWORDS for specific experts ---
    Object.entries(EXPERT_KEYWORDS).forEach(([category, keywords]) => {
        let expertScore = 0;
        (keywords as string[]).forEach(k => {
            const kLower = k.toLowerCase();
            if (lower === kLower) {
                expertScore += 25;
            } else if (lower.includes(kLower)) {
                expertScore += kLower.includes(' ') ? 12 : 6;
            }
            words.forEach(word => {
                if (kLower === word) expertScore += 8;
                else if (word.length >= 4 && (kLower.includes(word) || word.includes(kLower))) {
                    expertScore += 2;
                }
            });
        });

        if (expertScore > 0) {
            const mapping: Record<string, string | string[]> = {
                'skyline': 'SkylinePortfolio',
                'hindi': 'SpokenHindiPortfolio',
                'woodzone': 'WoodZonePortfolio',
                'thiran': 'Thiran360AIPortfolio',
                'swaraj': 'SwarajTractorPortfolio',
                'sunpower': 'SunPowerPortfolio',
                'mejestic': 'MejesticStudioPortfolio',
                'gv': 'GVBuildtechPortfolio',
                'srijeyam': 'SriJeyamPortfolio',
                'abirami': 'AbiramiPortfolio',
                'electricals': 'SakthiElectricalsPortfolio',
                
                // STG Esports
                'stg': 'STGEsportsPortfolio',
                'esports': 'STGEsportsPortfolio',
                'bgmi': 'STGEsportsPortfolio',
                'tournament': 'STGEsportsPortfolio',
                'tournaments': 'STGEsportsPortfolio',
                'gaming': 'STGEsportsPortfolio',
                'matches': 'STGEsportsPortfolio',
                'stg esports': 'STGEsportsPortfolio'
            };

            const targetScreens = mapping[category];
            if (targetScreens) {
                const screens = Array.isArray(targetScreens) ? targetScreens : [targetScreens];
                screens.forEach(screen => {
                    const existingScore = scores.get(screen) ?? 0;
                    scores.set(screen, existingScore + expertScore);
                });
            } else {
                const syntheticKey = `EXPERT_${category}`;
                if (!scores.has(syntheticKey)) {
                    const syntheticMatch: PortfolioMatch = {
                        screen: 'Experts',
                        name: category.charAt(0).toUpperCase() + category.slice(1) + ' Expert',
                        name_ta: 'à®¨à®¿à®ªà¯à®£à®°à¯',
                        description: `Connect with ${category} expert`,
                        description_ta: 'à®¨à®¿à®ªà¯à®£à®°à¯à®Ÿà®©à¯ à®‡à®£à¯ˆà®•à¯à®•à®µà¯à®®à¯',
                        icon: 'account-tie',
                        color: '#6366F1',
                        bg: '#EEF2FF',
                        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
                        keywords: keywords as string[],
                        category: category // Store the internal key to filter the Experts screen
                    };
                    
                    (findPortfolioMatches as any).syntheticMatches = (findPortfolioMatches as any).syntheticMatches || [];
                    (findPortfolioMatches as any).syntheticMatches.push({ match: syntheticMatch, score: expertScore });
                    scores.set(syntheticKey, expertScore);
                }
            }
        }
    });

    let maxScore = 0;
    for (const score of scores.values()) {
        if (score > maxScore) maxScore = score;
    }

    const result = Array.from(scores.entries())
        .filter(([_, score]) => score >= maxScore * 0.3) // Filter out low confidence matches
        .sort((a, b) => b[1] - a[1]) // Sort by score descending
        .map(([screen, score]) => {
            if (screen.startsWith('SERVICE_')) {
                const syntheticMatch = (findPortfolioMatches as any).syntheticMatches?.find((m: any) => m.match.category === screen.replace('SERVICE_', ''));
                return { ...syntheticMatch?.match, score };
            }
            if (screen.startsWith('EXPERT_')) {
                const syntheticMatch = (findPortfolioMatches as any).syntheticMatches?.find((m: any) => m.match.category === screen.replace('EXPERT_', ''));
                return { ...syntheticMatch?.match, score };
            }
            const portfolio = PORTFOLIO_SEARCH_MAP.find(p => p.screen === screen);
            return portfolio ? { ...portfolio, score } : null;
        })
        .filter(Boolean) as PortfolioMatch[];

    (findPortfolioMatches as any).syntheticMatches = [];
    return result;
}
