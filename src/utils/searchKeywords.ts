// Comprehensive keyword mapping for search functionality
// Supports both English and Tamil search terms for services and experts

export interface SearchKeywords {
    [key: string]: string[];
}

export const SERVICE_KEYWORDS: SearchKeywords = {
    smart_auto: [
        'automation', 'automate', 'smart home', 'touch switch', 'switch board',
        'switchboard', 'baas', 'electronic', 'home automation',
        'wifi switch', 'remote switch', 'à®¤à®¾à®©à®¿à®¯à®™à¯à®•à®¿', 'à®šà¯à®µà®¿à®Ÿà¯à®šà¯', 'à®Žà®²à¯†à®•à¯à®Ÿà¯à®°à®¾à®©à®¿à®•à¯',
        'à®¸à¯à®®à®¾à®°à¯à®Ÿà¯ à®¹à¯‹à®®à¯', 'à®¤à¯Šà®Ÿà¯ à®šà¯à®µà®¿à®Ÿà¯à®šà¯', 'à®ªà®¾à®¸à¯', 'à®¤à®¿à®±à®©à¯à®ªà¯‡à®šà®¿', 'à®¤à®¾à®©à®¿à®¯à®™à¯à®•à¯',
        'à®šà¯à®µà®¿à®Ÿà¯à®šà¯ à®ªà¯‹à®°à¯à®Ÿà¯', 'à®µà¯ˆà®ªà¯ˆ à®šà¯à®µà®¿à®Ÿà¯à®šà¯', 'à®°à®¿à®®à¯‹à®Ÿà¯ à®šà¯à®µà®¿à®Ÿà¯à®šà¯'
    ],
    electronics: [
        'electronics', 'circuit', 'pcb', 'gadget', 'repair',
        'chip', 'component', 'à®Žà®²à¯†à®•à¯à®Ÿà¯à®°à®¾à®©à®¿à®•à¯à®¸à¯', 'à®®à®¿à®©à¯à®©à®£à¯', 'à®ªà®´à¯à®¤à¯à®ªà®¾à®°à¯à®ªà¯à®ªà¯',
        'à®šà®°à¯à®•à¯à®¯à¯‚à®Ÿà¯', 'à®šà®¿à®ªà¯', 'à®‰à®¤à®¿à®°à®¿à®ªà®¾à®•à®™à¯à®•à®³à¯', 'à®Žà®²à¯†à®•à¯à®Ÿà¯à®°à®¾à®©à®¿à®•à¯ à®‰à®ªà®•à®°à®£à®™à¯à®•à®³à¯'
    ],
    upvc_nets: [
        'upvc', 'window', 'windows', 'door', 'doors', 'mosquito net',
        'mosquito', 'net', 'gv buildtech', 'gv', 'buildtech', 'à®šà®¾à®³à®°à®®à¯',
        'à®œà®©à¯à®©à®²à¯', 'à®•à®¤à®µà¯', 'à®•à¯Šà®šà¯ à®µà®²à¯ˆ', 'à®¯à¯à®ªà®¿à®µà®¿à®šà®¿', 'à®µà®²à¯ˆ', 'à®¸à¯à®•à®¿à®°à¯€à®©à¯', 'à®•à¯Šà®šà¯'
    ],
    tiles_furn: [
        'tiles', 'tile', 'floor', 'wall', 'furniture', 'wood', 'wooden',
        'sofa', 'bed', 'decor', 'wood zone', 'interior', 'à®ªà¯€à®°à¯‹', 'à®¨à®¾à®±à¯à®•à®¾à®²à®¿',
        'à®®à¯‡à®œà¯ˆ', 'à®Ÿà¯ˆà®²à¯à®¸à¯', 'à®¤à®³à®ªà®¾à®Ÿà®®à¯', 'à®®à®°à®®à¯', 'à®¤à®°à¯ˆ', 'à®šà¯à®µà®°à¯', 'à®šà¯‹à®ªà®¾', 'à®•à®Ÿà¯à®Ÿà®¿à®²à¯',
        'à®‰à®³à¯à®•à®Ÿà¯à®Ÿà®®à¯ˆà®ªà¯à®ªà¯'
    ],
    roofing: [
        'roofing', 'roof', 'shed', 'fabrication', 'skyline', 'ceiling',
        'à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®®à¯', 'à®•à¯‚à®°à¯ˆ', 'à®¸à¯à®•à¯ˆà®²à¯ˆà®©à¯', 'à®¨à®¿à®°à¯à®®à®¾à®£à®®à¯', 'à®·à¯†à®Ÿà¯', 'à®®à¯†à®Ÿà¯à®Ÿà®²à¯ à®°à¯‚à®ªà®¿à®™à¯'
    ],
    networking: [
        'network', 'wifi',
        'internet', 'lan', 'kaykar', 'shine', 'solar',
        'à®¨à¯†à®Ÿà¯à®µà¯Šà®°à¯à®•à¯', 'à®µà¯ˆà®ªà¯ˆ', 'à®‡à®©à¯à®Ÿà®°à¯à®¨à¯†à®Ÿà¯', 'à®‡à®£à¯ˆà®¯à®®à¯', 'à®šà¯‚à®°à®¿à®¯ à®’à®³à®¿'
    ],
    cctv: [
        'cctv', 'camera', 'security', 'surveillance', 'à®šà®¿à®šà®¿à®Ÿà®¿à®µà®¿', 'à®•à¯‡à®®à®°à®¾', 'à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà¯', 'à®•à®£à¯à®•à®¾à®£à®¿à®ªà¯à®ªà¯',
        'cctv camera fitting', 'surveylance', 'kankanippu', 'kamera', 'pathukappu', 'security system'
    ],
    hindi: [
        'hindi', 'language', 'class', 'learn', 'speaking', 'spoken',
        'academy', 'à®‡à®¨à¯à®¤à®¿', 'à®®à¯Šà®´à®¿', 'à®‡à®¨à¯à®¤à®¿ à®µà®•à¯à®ªà¯à®ªà¯', 'à®•à®±à¯à®•', 'à®…à®•à®¾à®Ÿà®®à®¿',
        'à®ªà¯‡à®šà¯à®šà¯ à®‡à®¨à¯à®¤à®¿', 'à®ªà®¯à®¿à®±à¯à®šà®¿'
    ],
    it_software: [
        'it', 'software', 'app', 'application', 'developer', 'coding', 'thiran', 'thiran360ai', 
        'website', 'development', 'software solution', 'à®à®Ÿà®¿', 'à®®à¯†à®©à¯à®ªà¯Šà®°à¯à®³à¯', 'à®†à®ªà¯', 'à®®à¯‡à®®à¯à®ªà®¾à®Ÿà¯', 
        'à®Ÿà¯†à®µà®²à®ªà¯à®ªà®°à¯', 'à®¤à®¿à®±à®©à¯', 'à®‡à®£à¯ˆà®¯à®¤à®³à®®à¯', 'à®•à¯‹à®Ÿà®¿à®™à¯'
    ],
    construction: [
        'construction', 'building', 'civil', 'contractor', 'engineer', 'skyline', 'builders',
        'à®•à®Ÿà¯à®Ÿà¯à®®à®¾à®©à®®à¯', 'à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®®à¯', 'à®šà®¿à®µà®¿à®²à¯', 'à®ªà¯Šà®±à®¿à®¯à®¾à®³à®°à¯', 'à®•à®Ÿà¯à®Ÿà¯à®®à®¾à®©à®ªà¯ à®ªà®£à®¿'
    ],
    painting: [
        'painting', 'paint', 'painter', 'wall', 'color', 'polish',
        'à®µà®°à¯à®£à®®à¯', 'à®ªà¯†à®¯à®¿à®£à¯à®Ÿà¯', 'à®šà¯à®µà®°à¯', 'à®¨à®¿à®±à®®à¯', 'à®šà¯à®£à¯à®£à®¾à®®à¯à®ªà¯', 'à®ªà¯†à®¯à®¿à®£à¯à®Ÿà®¿à®™à¯',
        'à®µà®°à¯à®£à®®à¯ à®ªà¯‚à®šà¯à®¤à®²à¯'
    ],
    carpentry: [
        'carpentry', 'carpenter', 'wood', 'furniture', 'door', 'shelf',
        'table', 'chair', 'à®®à®°à®µà¯‡à®²à¯ˆ', 'à®¤à®šà¯à®šà®©à¯', 'à®®à®°à®®à¯', 'à®¤à®³à®ªà®¾à®Ÿà®®à¯', 'à®…à®²à®®à®¾à®°à®¿',
        'à®®à¯‡à®œà¯ˆ', 'à®¨à®¾à®±à¯à®•à®¾à®²à®¿', 'à®¤à®šà¯à®šà¯ à®µà¯‡à®²à¯ˆ',
        // Tamil Transliteration & Colloquial
        'thachan', 'thachu velai', 'maram velai', 'mara velai', 'furniture repair',
        'narkali', 'measai repair', 'door lock repair', 'wood polish', 'mara vinyasam'
    ],

    swaraj: [
        'tractor', 'tractors', 'farming', 'agriculture', 'sales', 'service', 'spare parts', 'finance',
        'swaraj', 'saaral motors', 'saravanan', 'à®Ÿà®¿à®°à®¾à®•à¯à®Ÿà®°à¯', 'à®µà®¿à®µà®šà®¾à®¯à®®à¯', 'à®µà®¿à®±à¯à®ªà®©à¯ˆ', 'à®šà¯‡à®µà¯ˆ',
        'à®‰à®¤à®¿à®°à®¿à®ªà®¾à®•à®™à¯à®•à®³à¯', 'à®ªà¯ˆà®©à®¾à®©à¯à®¸à¯', 'à®šà®¾à®°à®²à¯ à®®à¯‹à®Ÿà¯à®Ÿà®¾à®°à¯à®¸à¯', 'à®šà®°à®µà®£à®©à¯',
        // Thanglish
        'tractor venum', 'vivasayam', 'tractor repair', 'vandi vanganum', 'tractor showroom',
        'farming tool', 'agriculture work'
    ],
    solar_power: [
        'solar', 'solar panel', 'solar system', 'solar pumps', 'solar street light', 'ongrid solar', 'offgrid solar',
        'ups', 'battery', 'inverter', 'water purifier', 'ro', 'ro system', 'ro water', 'water filter',
        'purifier service', 'prabakaran', 'sun power', 'equipments',
        'à®šà¯‹à®²à®¾à®°à¯', 'à®šà¯‹à®²à®¾à®°à¯ à®ªà¯‡à®©à®²à¯', 'à®šà¯‹à®²à®¾à®°à¯ à®ªà®®à¯à®ªà¯', 'à®šà¯‹à®²à®¾à®°à¯ à®¤à¯†à®°à¯ à®µà®¿à®³à®•à¯à®•à¯', 'à®®à®¿à®©à¯ à®šà¯à®¤à¯à®¤à®¿à®•à®°à®¿à®ªà¯à®ªà¯', 'à®µà®¾à®Ÿà¯à®Ÿà®°à¯ à®ªà®¿à®¯à¯‚à®°à®¿à®ƒà®ªà¯ˆà®¯à®°à¯',
        'à®ªà¯‡à®Ÿà¯à®Ÿà®°à®¿', 'à®‡à®©à¯à®µà¯†à®°à¯à®Ÿà¯à®Ÿà®°à¯', 'à®•à®µà¦¿à¦¨à§à¦¦à®ªà®¾à®Ÿà®¿', 'à®ªà®¿à®°à®ªà®¾à®•à®°à®©à¯', 'à®šà®©à¯ à®ªà®µà®°à¯',
        // Thanglish
        'solar set pannanum', 'solar panel price', 'solar pump set', 'water filter service', 'ro water purifier repair',
        'ups battery change', 'inverter battery', 'kavindapadi solar shop', 'prabakaran sun power'
    ],
    photography: [
        'photography', 'photo', 'video', 'candid', 'wedding photography', 'wedding shoot', 'photo studio',
        'camera', 'retouching', 'album', 'framing', 'mejestic', 'studio', 'arun',
        'à®¸à¯à®Ÿà¯à®Ÿà®¿à®¯à¯‹', 'à®ªà¯‹à®Ÿà¯à®Ÿà¯‹', 'à®ªà¯à®•à¯ˆà®ªà¯à®ªà®Ÿà®®à¯', 'à®ªà¯à®•à¯ˆà®ªà¯à®ªà®Ÿ à®•à®²à¯ˆà®žà®°à¯', 'à®¤à®¿à®°à¯à®®à®£ à®ªà¯‹à®Ÿà¯à®Ÿà¯‹', 'à®ªà¯‹à®Ÿà¯à®Ÿà¯‹à®·à¯‚à®Ÿà¯', 'à®•à¯‡à®®à®°à®¾', 'à®…à®°à¯à®£à¯',
        // Thanglish
        'studio venum', 'photo edukanum', 'wedding photoshoot venum', 'photoshoot pannunga', 'camera man venum', 'arun camera'
    ]
};

export const EXPERT_KEYWORDS: SearchKeywords = {
    swaraj: [
        'saravanan', 'saaral motors', 'tractor', 'sales', 'service', 'expert',
        'à®šà®°à®µà®£à®©à¯', 'à®šà®¾à®°à®²à¯ à®®à¯‹à®Ÿà¯à®Ÿà®¾à®°à¯à®¸à¯', 'à®Ÿà®¿à®°à®¾à®•à¯à®Ÿà®°à¯', 'à®µà®¿à®±à¯à®ªà®©à¯ˆ', 'à®šà¯‡à®µà¯ˆ', 'à®¨à®¿à®ªà¯à®£à®°à¯',
        // Thanglish
        'saravanan kita po', 'tractor expert', 'tractor sales expert'
    ],
    shine: [
        'vijai', 'security', 'computer', 'Computer services', 'printer', 'laptop', 'repair', 'toner', 'refill', 
        'à®®à®Ÿà®¿à®•à¯à®•à®£à®¿à®©à®¿', 'à®•à®£à®¿à®©à®¿ à®šà¯‡à®µà¯ˆà®•à®³à¯', 'à®ªà®´à¯à®¤à¯', 'à®®à¯†à®©à¯à®ªà¯Šà®°à¯à®³à¯', 'à®µà®©à¯à®ªà¯Šà®°à¯à®³à¯',
        // Tamil Transliteration & Colloquial
        'kanini', 'pazhuthu', 'sevvai', 'lapie', 'compuoter', 'printer service', 'system service',
        'madikkanini', 'vunporul', 'menporul', 'laptop seri seiya', 'ink refill'
    ],
    skyline: [
        'team', 'build', 'construction', 'interior', 'renovation', 'architect', 'builder', 'à®•à®Ÿà¯à®Ÿà®¿à®Ÿà®®à¯', 'à®®à®©à¯ˆ', 'à®•à®Ÿà¯à®Ÿà¯à®®à®¾à®©à®®à¯', 'à®µà®Ÿà®¿à®µà®®à¯ˆà®ªà¯à®ªà¯',
        // Tamil Transliteration & Colloquial
        'kattidam', 'veedu', 'manai', 'kattumanam', 'pudhu piku', 'civil work', 'vaasal', 'thoon',
        'vinyasam', 'vadivamaippu', 'veedu kattu', 'madi veedu', 'building plan'
    ],
    woodzone: [
        'tiles', 'furniture', 'decor', 'flooring', 'à®Ÿà¯ˆà®²à¯à®¸à¯', 'à®®à®°à®®à¯', 'à®®à¯‡à®œà¯ˆ', 'à®¤à®³à®ªà®¾à®Ÿà®®à¯', 'à®…à®²à®™à¯à®•à®¾à®°à®®à¯',
        // Tamil Transliteration & Colloquial
        'thalapadam', 'maram', 'mejai', 'measai', 'alankaram', 'wood work', 'furnicher',
        'marra thalapadam', 'kattil', 'alamari', 'sofa set', 'wood design'
    ],
    gv: [
        'fabrication', 'upvc', 'net', 'window', 'door', 'à®œà®©à¯à®©à®²à¯', 'à®µà®²à¯ˆ', 'à®•à®¤à®µà¯', 'à®šà®¾à®³à®°à®®à¯',
        // Tamil Transliteration & Colloquial
        'jannal', 'valai', 'kathavu', 'kadhavu', 'kannadi jannal', 'saalaram', 'upvc window',
        'mosquito net', 'kosu valai', 'grill gate', 'irumbu kadhavu', 'fabricasan'
    ],
    kaykar: [
        'team', 'network', 'solar', 'à®šà¯‚à®°à®¿à®¯ à®’à®³à®¿',
        // Tamil Transliteration & Colloquial
        'suriyan', 'solar panel', 'current plate', 'vevu', 'solar light'
    ],
    baas: [
        'tech', 'automation', 'automation app', 'electronic', 'switch', 'à®¤à®¾à®©à®¿à®¯à®™à¯à®•à®¿', 'à®ªà®¾à®¸à¯', 'à®®à®¿à®©à¯à®šà®¾à®°à®®à¯',
        // Tamil Transliteration & Colloquial
        'thaniyangi', 'automatic switch', 'smart home', 'remote light', 'munsaram',
        'electronic velai', 'automation system', 'bas tech', 'automation app'
    ],
    hindi: [
        'surendar', 'language', 'trainer', 'spoken', 'academy', 'à®‡à®¨à¯à®¤à®¿', 'à®ªà¯‡à®šà¯à®šà¯', 'à®ªà®¯à®¿à®±à¯à®šà®¿',
        // Tamil Transliteration & Colloquial
        'hindhi', 'hindi pesu', 'hindi padikka', 'hindi class', 'pechu', 'payirchi',
        'spoken hindi', 'hindi teacher', 'vada mozhi', 'hindi kathukko'
    ],
    thiran: [
        'founder', 'manickavasagar', 'it', 'software', 'app', 'application', 'developer', 'coding', 'thiran', 'thiran360ai', 
        'à®à®Ÿà®¿', 'à®®à¯†à®©à¯à®ªà¯Šà®°à¯à®³à¯', 'à®†à®ªà¯', 'à®®à¯‡à®®à¯à®ªà®¾à®Ÿà¯', 'à®Ÿà¯†à®µà®²à®ªà¯à®ªà®°à¯', 'à®¤à®¿à®±à®©à¯', 'à®®à®¾à®£à®¿à®•à¯à®•à®µà®¾à®šà®•à®°à¯',
        // Tamil Transliteration & Colloquial
        'menporul', 'app development', 'it company', 'coding velai', 'website pannunga', 'software solution'
    ],
    sunpower: [
        'prabakaran', 'srs prabakaran', 'jc srs prabakaran', 'sun power', 'Mega Sun Power Equipments',
        'solar expert', 'water purifier expert', 'ups', 'battery', 'kavindapadi',
        'à®ªà®¿à®°à®ªà®¾à®•à®°à®©à¯', 'à®šà®©à¯ à®ªà®µà®°à¯', 'à®šà¯‹à®²à®¾à®°à¯ à®¨à®¿à®ªà¯à®£à®°à¯', 'à®µà®¾à®Ÿà¯à®Ÿà®°à¯ à®ªà®¿à®¯à¯‚à®°à®¿à®ƒà®ªà¯ˆà®¯à®°à¯ à®¨à®¿à®ªà¯à®£à®°à¯',
        // Thanglish
        'prabakaran sir', 'prabakaran contact', 'kavindapadi sun power', 'solar consulting prabakaran'
    ],
    mejestic: [
        'arun', 'k arun', 'mejestic', 'majestic', 'studio', 'photography', 'wedding photography expert',
        'à®…à®°à¯à®£à¯', 'à®®à¯†à®œà®¸à¯à®Ÿà®¿à®•à¯', 'à®¸à¯à®Ÿà¯à®Ÿà®¿à®¯à¯‹', 'à®ªà¯à®•à¯ˆà®ªà¯à®ªà®Ÿà®®à¯',
        // Thanglish
        'arun camera', 'mejestic arun', 'photography expert arun', 'studio arun'
    ],
    srijeyam: [
        'prakash', 'c prakash', 'sri jayam', 'glass', 'upvc', 'pvc', 'doors',
        'à®ªà®¿à®°à®•à®¾à®·à¯', 'à®¸à¯à®°à¯€ à®œà¯†à®¯à®®à¯', 'à®•à®£à¯à®£à®¾à®Ÿà®¿', 'à®•à®¤à®µà¯', 'à®œà®©à¯à®©à®²à¯',
        // Thanglish
        'prakash glass', 'glass house', 'upvc expert prakash', 'sri jayam prakash'
    ],
    abirami: [
        'prabhu', 'manikandan', 'r prabhu', 'abirami', 'sri abirami', 'book binding', 'binding',
        'stationeries', 'stationery', 'note books', 'notebooks', 'bill book', 'calendar', 'notice',
        'à®…à®ªà®¿à®°à®¾à®®à®¿', 'à®ªà¯à®•à¯ à®ªà¯ˆà®£à¯à®Ÿà®¿à®™à¯', 'à®ªà¯à®¤à¯à®¤à®•à®®à¯', 'à®¨à¯‹à®Ÿà¯à®Ÿà¯', 'à®•à®¾à®²à®£à¯à®Ÿà®°à¯', 'à®¸à¯à®Ÿà¯‡à®·à®©à®°à®¿', 'à®ªà®¿à®²à¯ à®ªà¯à®•à¯',
        // Thanglish
        'abirami books', 'book binding prabhu', 'stationeries manikandan', 'bill book printing',
        'calendar printing', 'notice printing', 'note books wholesale'
    ]
};
