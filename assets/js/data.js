/* =========================================================
   Travell Kichwa — site data (demo)
   Edit SITE for real contact details.
   ========================================================= */

const SITE = {
  name: 'Travell Kichwa',
  tagline: 'Search. Plan. Travel.',
  phone: '+91 98765 43210',
  phoneRaw: '+919876543210',
  whatsapp: '919876543210',
  email: 'hello@travellkichwa.com',
  address: '2nd Floor, Kichwa House, MG Road, Gurugram, Haryana 122002',
  mapQuery: 'MG Road, Gurugram, Haryana',
  hours: 'Mon – Sat · 9:30 AM – 7:30 PM',
  instagram: 'travellkichwa',
  facebook: 'travellkichwa',
  youtube: 'travellkichwa'
};

/* ---------- Images ----------
   w: = Wikimedia Commons file path, u: = Unsplash photo id */
const IMG = {
  ladakh_road: 'w:8/8d/Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg',
  pangong: 'w:c/c9/Late_afternoon_at_the_Pangong_Tso_%2810035239163%29.jpg',
  pangong2: 'w:8/8b/Pangong_Tso_2.jpg',
  nubra: 'w:7/71/Nubra_Valley_2.jpg',
  diskit: 'w:1/16/Diskit_Gompa_2.jpg',
  thiksey: 'w:a/a6/Thiksey_Monastery%2C_Ladakh_01.jpg',
  leh_palace: 'w:c/ce/Leh_Palace_from_Central_Asian_Museum.jpg',
  manali_leh_hwy: 'w:a/a6/Zingzing_Bar_Suraj_Tal_Himachal_Jul19_D72_10907.jpg',
  key_monastery: 'w:4/4c/Key_Monastery.jpg',
  dhankar: 'w:b/b2/Dhankar_Gompa%2C_Spiti.jpg',
  chandratal: 'w:8/88/Chandra_Taal_%28Lake%29%2C_HP%2C_India%2C_D35_7333_nx01.jpg',
  spiti_valley: 'w:3/3f/Spiti_River_Kaza_Himachal_Jun18_D72_7232.jpg',
  pin_valley: 'w:4/46/Pin_Valley_Spiti_Himachal_Jun18_D72_7092.jpg',
  kaza_road: 'w:c/c0/NH505_Spiti_Kaza_Losar_Jun18_D72_7797.jpg',
  dal_lake: 'w:e/e1/Dal_Lake_Hazratbal_Srinagar.jpg',
  houseboats: 'w:1/17/Dal_Lake%2C_Srinagar%2C_Jammu_and_Kashmir.jpg',
  shikara: 'w:1/16/Empty_shikara_on_Dal_Lake%2C_Srinagar%2C_India_2013-08-23_%28flickr_9967093983%29.jpg',
  gulmarg: 'w:9/96/Gulmarg_Gondola%2C_Cable_Car.JPG',
  pahalgam: 'w:f/f6/Pahalgam_Valley.jpg',
  sonamarg: 'w:4/46/Mountain_Meadow_in_Sonamarg%2C_Kashmir%2C_India.jpg',
  sonamarg_lake: 'w:3/31/Vishansar_Lake%2C_Sonmarg%2C_Kashmir.jpg',
  solang_snow: 'w:2/2c/Solang_valley_under_snow%2C_2015.jpg',
  beas_valley: 'w:5/57/Beas_Valley_-_Palchan_-_Kullu_2014-05-10_%28edit%29.jpg',
  manali_valley: 'w:3/3f/Simsa_Manali_East_Himachal_Oct22_A7C_03328.jpg',
  manali_snow: 'w:d/de/Snow_Rohtang_Range_Manali_May24_A7CR_00128.jpg',
  hadimba: 'w:3/3a/Hidimba_Devi_Temple%2C_Dhungri_Manali_2.jpg',
  hawa_mahal: 'w:4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
  camel_dunes: 'w:8/85/D%C3%A9sert_du_Thar.jpg',
  camel: 'w:9/90/Dromedary_in_Thar_desert.jpg',
  amer_fort: 'w:0/05/Jaipur_03-2016_05_Amber_Fort.jpg',
  amer_lake: 'w:f/f7/Jaipur_03-2016_02_Amber_Fort.jpg',
  jaisalmer_fort: 'w:5/5e/Jaisalmer_Fort%2C_India.jpg',
  mehrangarh: 'w:2/23/20191210_Mehrangarh_Fort%2C_Jodhpur_1016_7834.jpg',
  udaipur: 'w:f/fb/20191207_Lake_Pichola%2C_Udaipur%2C_1531_7276.jpg',
  houseboat_tree: 'w:e/e4/Alappuzha_Boat_Beauty_W.jpg',
  backwaters: 'w:c/c6/Kerala_backwaters%2C_Palm_trees%2C_India.jpg',
  munnar_tea: 'w:0/09/Munnar_-_Tea_Plantations.jpg',
  munnar_lake: 'w:a/af/Mattupetty_Lake_View.jpg',
  fishing_nets: 'w:5/53/Chinese_Fishing_Nets_-_4.jpg',
  palolem: 'w:7/7b/Palolem_Beach_%285580920479%29.jpg',
  goa_shacks: 'w:c/cf/Anjuna_Beach%2C_Goa%2C_India%2C_Legendary_Curlies_beach_shack.jpg',
  bom_jesus: 'w:9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
  aguada: 'w:7/7c/Aguada_Fort_Top_View%2C_North_Goa.jpg',
  goa_loungers: 'w:9/9d/Sunloungers_at_Palolem_beach.jpg',
  havelock: 'w:5/51/Havelock_Island%2C_Mangrove_tree_on_the_beach%2C_Andaman_Islands.jpg',
  havelock2: 'w:e/e9/Havelock_Island%2C_Ethereal_mangrove_tree%2C_Andaman_Islands.jpg',
  andaman_sea: 'w:3/32/Andaman_Sea%2C_Andaman_Islands.jpg',
  neil: 'w:c/c5/Shaheed_Island%2C_Andaman_Islands%2C_Tropical_beach.jpg',
  laxman_jhula: 'w:5/5d/Ganga_ghats%2C_Laxman_jhula%2C_Rishikesh_2.jpg',
  rishikesh: 'w:1/13/Ganga_ghats%2C_Laxman_jhula%2C_Rishikesh.jpg',
  laxman_bridge: 'w:7/7e/Laxman_Jhula_Bridge.jpg',
  ganga_aarti: 'w:0/09/Ganga_Aarti_in_Haridwar.jpg',
  gypsy_safari: 'w:3/3e/Jeep_Safari_in_Bandhavgarh.jpg',
  tiger_road: 'w:4/49/Bengal_Tiger_at_Jim_Corbett_National_Park.jpg',
  peacock: 'w:f/fb/023_Indian_peafowl_in_Jim_Corbett_National_Park_Photo_by_Giles_Laurent.jpg',
  jeep_forest: 'w:7/7b/Safari_jeep_%285343353822%29.jpg',
  corbett_jhirna: 'w:e/e2/The_jungle_safari_in_Jhirna_Zone%2C_Jim_Corbett_National_Park.jpg',
  kaziranga: 'w:2/2a/Jeep_Safari_Kaziranga%2C_Central_Zone_%28Kohara%29.jpg',
  thar: 'w:b/b7/Mahindra_Thar_ROXX_on_rocks.jpg',
  dubai_dunes: 'w:b/b9/Black_Chevrolet_Suburban_%28Desert_Safari_Dubai%29_%288667292413%29.jpg',
  dubai_marina: 'w:e/e6/Dubai_Marina_Skyline.jpg',
  dubai_canal: 'w:e/e5/UAE_Dubai_Marina_img1_asv2018-01.jpg',
  dubai_cruiser: 'w:5/5f/Land_Cruiser_in_Dubai_Desert_Safari.jpg',

  kerala_houseboat: 'u:1602216056096-3b40cc0c9944',
  kerala_backwater: 'u:1593693397690-362cb9666fc2',
  goa_beach: 'u:1512343879784-a960bf40e7f2',
  hill_trek: 'u:1626621341517-bbf3d9990a23',
  ladakh_bike: 'u:1581793745862-99fde7fa73d2',
  dubai: 'u:1512453979798-5ea266f8880c',
  burj_al_arab: 'u:1518684079-3c830dcef090',
  bali_temple: 'u:1537996194471-e657df975ab4',
  bali_sunset: 'u:1518548419970-58e3b4079ab2',
  bali_green: 'u:1555400038-63f5ba517a47',
  kelingking: 'u:1539367628448-4bc5c9d171c8',
  maldives: 'u:1514282401047-d79a71a590e8',
  maldives_villas: 'u:1573843981267-be1999ff37cd',
  maldives_island: 'u:1540202404-a2f29016b523',
  phi_phi: 'u:1552465011-b4e21bf6e79a',
  thai_temple: 'u:1528181304800-259b08848526',
  thai_cliffs: 'u:1506665531195-3566af2b4dfa',
  swiss_alps: 'u:1527668752968-14dc70a27c95',
  swiss_valley: 'u:1530122037265-a5f1f91d3b99',
  snow_peaks: 'u:1454496522488-7a8e488e8606',
  peak_dusk: 'u:1483728642387-6c3bdd6c93e5',
  eiffel: 'u:1502602898657-3e91760cbb34',
  safari_sunset: 'u:1516426122078-c23e76319801',
  acacia: 'u:1547471080-7cc2caa01a7e',
  giraffe: 'u:1523805009345-7448845a9e53',
  elephant: 'u:1535941339077-2dd1c7963098',
  elephants_dusk: 'u:1564760055775-d63b17a55c44',
  tiger: 'u:1561731216-c3a4d99437d5',
  beach_sunset: 'u:1507525428034-b723cf961d3e',
  infinity_pool: 'u:1540541338287-41700207dee6',
  resort_palms: 'u:1520250497591-112f2f40a3f4',
  resort_pool: 'u:1571003123894-1f0594d2b5d9',
  hotel_night: 'u:1542314831-068cd1dbfeeb',
  camp_night: 'u:1478131143081-80f7f84ca84d',
  tent_view: 'u:1504280390367-361c6d9f38f4',
  van_road: 'u:1469854523086-cc02fe5d8800',
  planning: 'u:1488646953014-85cb44e25828',
  plane_wing: 'u:1436491865332-7a61a109cc05',
  stars_peaks: 'u:1519681393784-d120267933ba'
};

function img(key, w = 960) {
  const v = IMG[key];
  if (!v) return '';
  if (v.startsWith('u:')) return `https://images.unsplash.com/photo-${v.slice(2)}?auto=format&fit=crop&w=${w}&q=72`;
  const path = v.slice(2);
  const file = path.split('/').pop();
  const size = [330, 500, 960, 1280, 1920].find(s => s >= w) || 1920;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${size}px-${file}`;
}

/* ---------- Lookups ---------- */
const FEATURES = {
  stay: ['ri-hotel-bed-line', 'Stays'],
  meals: ['ri-restaurant-line', 'Meals'],
  jeep: ['ri-roadster-line', '4x4 jeep'],
  cab: ['ri-taxi-line', 'Private cab'],
  boat: ['ri-sailboat-line', 'Cruise'],
  camp: ['ri-tent-line', 'Camping'],
  raft: ['ri-water-flash-line', 'Rafting'],
  sight: ['ri-camera-3-line', 'Sightseeing'],
  visa: ['ri-passport-line', 'Visa'],
  safari: ['ri-bear-smile-line', 'Safari'],
  train: ['ri-train-line', 'Rail pass']
};

const CATEGORIES = [
  { id: 'Adventure', icon: 'ri-landscape-line' },
  { id: 'Road Trip', icon: 'ri-roadster-line' },
  { id: 'Honeymoon', icon: 'ri-hearts-line' },
  { id: 'Family', icon: 'ri-parent-line' },
  { id: 'Wildlife', icon: 'ri-bear-smile-line' },
  { id: 'Beach', icon: 'ri-sun-line' },
  { id: 'Heritage', icon: 'ri-ancient-gate-line' },
  { id: 'Spiritual', icon: 'ri-leaf-line' },
  { id: 'Weekend', icon: 'ri-calendar-check-line' },
  { id: 'Luxury', icon: 'ri-vip-crown-line' }
];

const TIERS = [
  { id: 'standard', name: 'Standard', note: '3★ hotels & camps', mult: 1 },
  { id: 'deluxe', name: 'Deluxe', note: '4★ hotels, better views', mult: 1.2 },
  { id: 'luxury', name: 'Luxury', note: '5★ & boutique stays', mult: 1.5 }
];

const ADDONS = [
  { id: 'insurance', name: 'Travel insurance', note: 'Medical cover & trip-delay protection', price: 599, per: 'person', icon: 'ri-shield-check-line' },
  { id: 'airport', name: 'Airport transfers', note: 'Private pickup & drop, flight tracked', price: 1499, per: 'booking', icon: 'ri-flight-land-line' },
  { id: 'photo', name: 'Trip photographer', note: 'Half-day shoot at a scenic spot', price: 3999, per: 'booking', icon: 'ri-camera-lens-line' },
  { id: 'celebrate', name: 'Celebration kit', note: 'Cake, décor & a surprise on the trip', price: 1999, per: 'booking', icon: 'ri-gift-line' }
];

const COUPONS = {
  KICHWA10: { label: '10% off on all trips (max ₹5,000)', type: 'pct', value: 10, max: 5000 },
  FIRSTTRIP: { label: 'Flat ₹1,500 off your first trip (min ₹10,000)', type: 'flat', value: 1500, min: 10000 },
  JEEP500: { label: '₹500 off jeep safaris & rides', type: 'flat', value: 500, kinds: ['safari', 'cab'] }
};

/* ---------- Destinations ---------- */
const DESTINATIONS = [
  { slug: 'ladakh', name: 'Ladakh', region: 'india', area: 'Union Territory of Ladakh', tagline: 'Land of high passes', img: 'pangong', best: 'Jun – Sep' },
  { slug: 'kashmir', name: 'Kashmir', region: 'india', area: 'Jammu & Kashmir', tagline: 'Paradise on earth', img: 'dal_lake', best: 'Mar – Oct' },
  { slug: 'kerala', name: 'Kerala', region: 'india', area: 'South India', tagline: "God's own country", img: 'kerala_houseboat', best: 'Sep – Mar' },
  { slug: 'rajasthan', name: 'Rajasthan', region: 'india', area: 'North-west India', tagline: 'Forts, palaces & the Thar', img: 'hawa_mahal', best: 'Oct – Mar' },
  { slug: 'goa', name: 'Goa', region: 'india', area: 'West coast', tagline: 'Sun, sand & shacks', img: 'palolem', best: 'Nov – Feb' },
  { slug: 'spiti', name: 'Spiti Valley', region: 'india', area: 'Himachal Pradesh', tagline: 'The middle land', img: 'chandratal', best: 'Jun – Oct' },
  { slug: 'himachal', name: 'Manali', region: 'india', area: 'Himachal Pradesh', tagline: 'Snow, cedar & cafés', img: 'solang_snow', best: 'Oct – Jun' },
  { slug: 'andaman', name: 'Andaman', region: 'india', area: 'Andaman & Nicobar Islands', tagline: 'Turquoise island time', img: 'havelock', best: 'Oct – May' },
  { slug: 'uttarakhand', name: 'Uttarakhand', region: 'india', area: 'Rishikesh & Jim Corbett', tagline: 'Rapids, aarti & tigers', img: 'tiger_road', best: 'Sep – Jun' },
  { slug: 'dubai', name: 'Dubai', region: 'intl', area: 'United Arab Emirates', tagline: 'Skylines & red dunes', img: 'dubai', best: 'Nov – Mar' },
  { slug: 'bali', name: 'Bali', region: 'intl', area: 'Indonesia', tagline: 'Temples & rice terraces', img: 'bali_temple', best: 'Apr – Oct' },
  { slug: 'maldives', name: 'Maldives', region: 'intl', area: 'Indian Ocean', tagline: 'Overwater everything', img: 'maldives', best: 'Nov – Apr' },
  { slug: 'thailand', name: 'Thailand', region: 'intl', area: 'Phuket & Krabi', tagline: 'Island-hopping paradise', img: 'phi_phi', best: 'Nov – Apr' },
  { slug: 'kenya', name: 'Kenya', region: 'intl', area: 'Masai Mara', tagline: 'The great migration', img: 'safari_sunset', best: 'Jul – Oct' },
  { slug: 'europe', name: 'Switzerland', region: 'intl', area: 'Switzerland & Paris', tagline: 'The Alps by rail', img: 'swiss_alps', best: 'May – Sep' }
];

/* ---------- Packages ---------- */
const GST_NOTE = 'GST (5%)';
const PACKAGES = [
  {
    id: 'ladakh-jeep-expedition', title: 'Ladakh Jeep Expedition', dest: 'ladakh', region: 'india',
    places: 'Leh · Nubra · Pangong · Khardung La', nights: 7, days: 8, price: 32999, old: 38999, rating: 4.9, reviews: 412,
    cats: ['Adventure', 'Road Trip'], badge: 'Bestseller', cover: 'ladakh_road',
    gallery: ['pangong', 'diskit', 'nubra', 'thiksey', 'manali_leh_hwy', 'leh_palace', 'ladakh_bike'],
    feats: ['stay', 'jeep', 'meals', 'sight'],
    summary: 'High passes, blue lakes and ancient monasteries — eight days in a 4x4 with a local trip captain.',
    about: [
      "Ladakh is a road-tripper's dream: moonscape valleys, prayer-flag passes and lakes that change colour by the hour. This expedition is paced for acclimatisation, so you enjoy every kilometre instead of just surviving it.",
      'You travel in a dedicated 4x4 with an experienced mountain driver, stay in handpicked hotels and Swiss-tent camps, and cross Khardung La and Chang La — two of the highest motorable passes on earth.'
    ],
    highlights: ['Sunset & sunrise at Pangong Tso', 'Drive over Khardung La (17,582 ft)', 'Double-humped camels at Hunder dunes', 'Thiksey & Diskit monasteries', 'Swiss-tent camps in Nubra & Pangong', 'Oxygen & first-aid in every vehicle'],
    itinerary: [
      ['Arrive in Leh · acclimatise', 'Airport pickup and transfer to your hotel. Rest to adjust to the altitude, then a gentle sunset walk to Shanti Stupa.', 'Dinner', 'Hotel, Leh'],
      ['Leh sightseeing', 'Hall of Fame, Gurudwara Pathar Sahib, the mysterious Magnetic Hill and the Indus–Zanskar confluence at Sangam.', 'Breakfast, Dinner', 'Hotel, Leh'],
      ['Leh → Nubra via Khardung La', 'Photos at the top of Khardung La, then down into Nubra. Visit Diskit Monastery and ride double-humped camels at the Hunder sand dunes.', 'Breakfast, Dinner', 'Swiss camp, Nubra'],
      ['Nubra → Pangong via Shyok', 'An off-road classic along the Shyok river — the reason we drive 4x4s. Reach Pangong Tso by afternoon and watch it turn from turquoise to deep blue.', 'Breakfast, Dinner', 'Lakeside camp, Pangong'],
      ['Pangong → Leh via Chang La', 'Sunrise over the lake, then back to Leh over Chang La with stops at Thiksey Monastery and Shey Palace.', 'Breakfast, Dinner', 'Hotel, Leh'],
      ['Sham Valley day trip', 'Likir, Alchi and Basgo — thousand-year-old murals, apricot orchards and the Indus in its canyon.', 'Breakfast, Dinner', 'Hotel, Leh'],
      ['Leisure day in Leh', 'Café-hop, shop for pashmina and Ladakhi silver at Leh Market, and end with a farewell dinner with your trip captain.', 'Breakfast, Dinner', 'Hotel, Leh'],
      ['Departure', 'Early breakfast and drop at Leh airport with a head full of mountains.', 'Breakfast', '—']
    ],
    inc: ['7 nights in handpicked hotels & Swiss-tent camps', 'Daily breakfast & dinner', 'Dedicated 4x4 (Scorpio / Innova / Thar) with mountain driver', 'Inner-line permits & environment fees', 'Oxygen cylinder & first-aid in vehicle', 'Airport pickup & drop', 'Trip captain & 24×7 on-trip support'],
    exc: ['Flights to / from Leh', 'Lunches & snacks', 'Monument entry & camera fees', 'Camel ride at Hunder', 'Personal expenses & tips', GST_NOTE],
    facts: { group: '2 – 12 travellers', best: 'Jun – Sep', start: 'Leh airport', level: 'Moderate · high altitude' }
  },
  {
    id: 'spiti-valley-road-trip', title: 'Spiti Valley Road Trip', dest: 'spiti', region: 'india',
    places: 'Shimla · Kalpa · Kaza · Chandratal', nights: 6, days: 7, price: 24999, old: 28999, rating: 4.8, reviews: 268,
    cats: ['Adventure', 'Road Trip'], badge: 'Trending', cover: 'key_monastery',
    gallery: ['chandratal', 'spiti_valley', 'dhankar', 'kaza_road', 'pin_valley'],
    feats: ['stay', 'jeep', 'meals', 'camp'],
    summary: 'A raw high-desert circuit of cliff-top monasteries, fossil villages and the moon lake — Chandratal.',
    about: [
      'Spiti is Himalayan India at its most untouched — 4,000-metre villages, fossil-strewn slopes and monasteries clinging to cliffs. We drive the classic Kinnaur-to-Spiti circuit so the altitude builds gently.',
      'Nights are spent in cosy hotels and homestays run by local families, and the road ends with the unreal blue of Chandratal before the Atal Tunnel brings you down to Manali.'
    ],
    highlights: ['Key, Dhankar & Tabo monasteries', "World's highest post office at Hikkim", 'Fossil hunting in Langza', 'Night under the stars at Chandratal', 'Kinnaur Kailash views from Kalpa', 'Exit via the Atal Tunnel'],
    itinerary: [
      ['Shimla → Kalpa', 'Leave Shimla early and follow the Sutlej into Kinnaur. Evening views of the Kinnaur Kailash range.', 'Dinner', 'Hotel, Kalpa'],
      ['Kalpa → Tabo', 'The dramatic Hindustan–Tibet road past Nako lake to Tabo, home to a 1,000-year-old monastery.', 'Breakfast, Dinner', 'Homestay, Tabo'],
      ['Tabo → Kaza via Dhankar', 'Stop at Dhankar monastery perched on a crumbling cliff, then continue to Kaza, Spiti\'s little capital.', 'Breakfast, Dinner', 'Hotel, Kaza'],
      ['Kaza villages loop', 'Key Monastery, Kibber, Chicham bridge, the fossil village of Langza and the world\'s highest post office at Hikkim.', 'Breakfast, Dinner', 'Hotel, Kaza'],
      ['Kaza → Chandratal', 'Cross Kunzum La to the crescent-shaped Chandratal lake. Camp under a sky full of stars.', 'Breakfast, Dinner', 'Camp, Chandratal'],
      ['Chandratal → Manali', 'Ford glacial streams on the way to Gramphu and zip through the Atal Tunnel to Manali.', 'Breakfast, Dinner', 'Hotel, Manali'],
      ['Departure', 'Breakfast and onward journey from Manali.', 'Breakfast', '—']
    ],
    inc: ['6 nights in hotels, homestays & camps', 'Breakfast & dinner daily', 'SUV / Tempo Traveller with expert hill driver', 'Permits & sightseeing as per itinerary', 'Trip captain', 'First-aid & oxygen support'],
    exc: ['Travel to Shimla & from Manali', 'Lunches', 'Monument fees', 'Personal expenses', GST_NOTE],
    facts: { group: '4 – 14 travellers', best: 'Jun – Oct', start: 'Shimla', level: 'Moderate · remote roads' }
  },
  {
    id: 'kashmir-paradise', title: 'Kashmir — Paradise on Earth', dest: 'kashmir', region: 'india',
    places: 'Srinagar · Gulmarg · Pahalgam · Sonamarg', nights: 5, days: 6, price: 21499, old: 25999, rating: 4.9, reviews: 356,
    cats: ['Honeymoon', 'Family'], badge: 'Bestseller', cover: 'dal_lake',
    gallery: ['houseboats', 'gulmarg', 'pahalgam', 'sonamarg_lake', 'shikara', 'sonamarg'],
    feats: ['stay', 'cab', 'meals', 'boat'],
    summary: 'Houseboat nights on Dal Lake, gondola rides in Gulmarg and meadows straight out of a film set.',
    about: [
      'Kashmir earns its nickname the moment your shikara glides onto Dal Lake. This trip balances the classics — Gulmarg, Pahalgam and Sonamarg — with slow evenings on a heritage houseboat.',
      'It works beautifully for couples and families alike: a private cab throughout, handpicked stays and flexible sightseeing you can tweak on the go.'
    ],
    highlights: ['Night on a heritage houseboat', 'Sunset shikara ride on Dal Lake', 'Gulmarg Gondola (phase 1)', 'Betaab & Aru valleys, Pahalgam', 'Thajiwas glacier at Sonamarg', 'Mughal gardens of Srinagar'],
    itinerary: [
      ['Arrive Srinagar · houseboat', 'Airport pickup, check in to a carved-cedar houseboat and float past the floating markets on a sunset shikara.', 'Dinner', 'Houseboat, Dal Lake'],
      ['Sonamarg day trip', "Follow the Sindh river to the 'meadow of gold'. Optional pony ride to Thajiwas glacier.", 'Breakfast, Dinner', 'Hotel, Srinagar'],
      ['Srinagar → Gulmarg', 'Ride the Gulmarg Gondola to Kongdoori for snow and sweeping views of the Pir Panjal.', 'Breakfast, Dinner', 'Hotel, Gulmarg'],
      ['Gulmarg → Pahalgam', 'Drive past the saffron fields of Pampore to Pahalgam, the valley of shepherds.', 'Breakfast, Dinner', 'Hotel, Pahalgam'],
      ['Pahalgam → Srinagar', 'Betaab valley and Aru in the morning, then Nishat & Shalimar Bagh back in Srinagar.', 'Breakfast, Dinner', 'Hotel, Srinagar'],
      ['Departure', 'A last cup of kahwa, some shopping for dry fruits and pashmina, and airport drop.', 'Breakfast', '—']
    ],
    inc: ['1 night houseboat + 4 nights hotels', 'Breakfast & dinner', 'Private cab for all transfers & sightseeing', 'Shikara ride (1 hour)', 'Airport pickup & drop', 'Tolls, parking & driver charges'],
    exc: ['Flights', 'Gondola tickets & pony rides', 'Local union cabs in Pahalgam / Sonamarg', 'Lunches', GST_NOTE],
    facts: { group: '2 – 10 travellers', best: 'Mar – Oct · Dec – Feb for snow', start: 'Srinagar airport', level: 'Easy' }
  },
  {
    id: 'manali-solang-escape', title: 'Manali & Solang Snow Escape', dest: 'himachal', region: 'india',
    places: 'Manali · Solang · Sissu · Kasol', nights: 4, days: 5, price: 12999, old: 15499, rating: 4.7, reviews: 521,
    cats: ['Honeymoon', 'Family', 'Weekend'], badge: 'Value pick', cover: 'solang_snow',
    gallery: ['beas_valley', 'manali_valley', 'hadimba', 'manali_snow', 'hill_trek'],
    feats: ['stay', 'cab', 'meals', 'sight'],
    summary: 'Snow play at Solang, the Atal Tunnel to Sissu and slow café evenings in Old Manali.',
    about: [
      'The easiest way to trade the city for pine forests and snow. Short drives, cosy stays and just enough adventure — paragliding and snow sports at Solang are one tap away.',
      'We add a day in Kasol and Manikaran for riverside cafés and the hot springs, then leave you time to wander Old Manali at your own pace.'
    ],
    highlights: ['Snow activities at Solang valley', 'Atal Tunnel drive to Sissu', 'Hadimba Devi temple in a cedar forest', 'Kasol cafés & Manikaran Sahib', 'Vashisht hot springs', 'Optional paragliding'],
    itinerary: [
      ['Arrive Manali', 'Check in, then explore Mall Road and the Hadimba Devi temple set in a deodar forest.', 'Dinner', 'Hotel, Manali'],
      ['Solang & Atal Tunnel', 'Snow and adventure sports at Solang, then through the 9 km Atal Tunnel to Sissu waterfall in Lahaul.', 'Breakfast, Dinner', 'Hotel, Manali'],
      ['Kasol & Manikaran', 'A day in the Parvati valley — riverside walks, cafés and the langar at Manikaran Sahib.', 'Breakfast, Dinner', 'Hotel, Manali'],
      ['Old Manali & Vashisht', 'Morning at the Vashisht hot springs, afternoon café-hopping in Old Manali.', 'Breakfast, Dinner', 'Hotel, Manali'],
      ['Departure', 'Breakfast and drop at the Volvo stand or Bhuntar airport.', 'Breakfast', '—']
    ],
    inc: ['4 nights in a hill-view hotel', 'Breakfast & dinner', 'Private cab for sightseeing', 'Atal Tunnel permit', 'Bonfire evening'],
    exc: ['Travel to / from Manali', 'Adventure activities', 'Rohtang permit (if chosen)', 'Lunches', GST_NOTE],
    facts: { group: '2 – 8 travellers', best: 'Oct – Mar for snow', start: 'Manali', level: 'Easy' }
  },
  {
    id: 'royal-rajasthan', title: 'Royal Rajasthan & Thar Desert', dest: 'rajasthan', region: 'india',
    places: 'Jaipur · Jodhpur · Jaisalmer · Sam Dunes', nights: 6, days: 7, price: 26999, old: 31999, rating: 4.8, reviews: 298,
    cats: ['Heritage', 'Family', 'Road Trip'], badge: 'Desert safari', cover: 'camel_dunes',
    gallery: ['hawa_mahal', 'amer_fort', 'jaisalmer_fort', 'mehrangarh', 'camel', 'amer_lake'],
    feats: ['stay', 'jeep', 'meals', 'sight'],
    summary: 'Forts, palaces and a night in the Thar — with a jeep dune safari at sunset.',
    about: [
      'Rajasthan is best experienced slowly: pink bazaars in Jaipur, the blue lanes of Jodhpur and the golden fort-city of Jaisalmer rising out of the desert.',
      'The finale is our favourite — a 4x4 jeep and camel safari across the Sam dunes, followed by folk music and dinner under the stars at a desert camp.'
    ],
    highlights: ['Amber Fort & Hawa Mahal', 'Mehrangarh Fort, Jodhpur', 'The living fort of Jaisalmer', 'Jeep + camel safari on Sam dunes', 'Night at a luxury desert camp', 'Rajasthani folk evening'],
    itinerary: [
      ['Arrive Jaipur', 'Hawa Mahal, City Palace and Jantar Mantar. Evening in the bazaars of the Pink City.', 'Dinner', 'Hotel, Jaipur'],
      ['Amber Fort & Jal Mahal', 'Morning at Amber Fort, then Jal Mahal and Nahargarh for sunset over the city.', 'Breakfast, Dinner', 'Hotel, Jaipur'],
      ['Jaipur → Jodhpur', 'Drive to the Blue City and walk the ramparts of Mehrangarh Fort.', 'Breakfast, Dinner', 'Heritage hotel, Jodhpur'],
      ['Jodhpur → Jaisalmer', 'Cross the Thar to the Golden City. Sunset at Gadisar lake.', 'Breakfast, Dinner', 'Hotel, Jaisalmer'],
      ['Jaisalmer Fort · Sam dunes safari', 'Explore the living fort and Patwon ki Haveli, then jeep dune-bashing and a camel safari at sunset. Folk music and dinner at camp.', 'Breakfast, Dinner', 'Desert camp, Sam'],
      ['Jaisalmer → Jodhpur', 'Sunrise over the dunes and a leisurely drive back to Jodhpur.', 'Breakfast, Dinner', 'Hotel, Jodhpur'],
      ['Departure', 'Drop at Jodhpur airport or railway station.', 'Breakfast', '—']
    ],
    inc: ['6 nights incl. 1 night desert camp', 'Breakfast & dinner', 'AC SUV for the full circuit', 'Jeep & camel safari at Sam', 'Cultural evening at camp', 'Airport / station transfers'],
    exc: ['Flights / trains', 'Monument entry fees', 'Lunches', 'Guide charges', GST_NOTE],
    facts: { group: '2 – 12 travellers', best: 'Oct – Mar', start: 'Jaipur', level: 'Easy' }
  },
  {
    id: 'kerala-backwaters', title: 'Kerala Backwaters Bliss', dest: 'kerala', region: 'india',
    places: 'Kochi · Munnar · Thekkady · Alleppey', nights: 5, days: 6, price: 19999, old: 23999, rating: 4.8, reviews: 344,
    cats: ['Honeymoon', 'Family'], badge: 'Couple favourite', cover: 'kerala_houseboat',
    gallery: ['houseboat_tree', 'munnar_tea', 'munnar_lake', 'fishing_nets', 'backwaters', 'kerala_backwater'],
    feats: ['stay', 'boat', 'meals', 'cab'],
    summary: 'Tea-covered hills, spice gardens and a private houseboat night on the Alleppey backwaters.',
    about: [
      'From the misty tea estates of Munnar to the spice-scented forests of Thekkady, Kerala slows you down in the best way.',
      'The highlight is a private houseboat — your own floating villa with a chef who cooks fresh Kerala meals as you drift past paddy fields and village life.'
    ],
    highlights: ['Private houseboat overnight in Alleppey', 'Munnar tea estates & Eravikulam', 'Spice plantation walk, Thekkady', 'Boating on Periyar lake', 'Chinese fishing nets at Fort Kochi', 'Kathakali performance'],
    itinerary: [
      ['Arrive Kochi', 'Fort Kochi walk: Chinese fishing nets, St. Francis church and a Kathakali show in the evening.', 'Dinner', 'Hotel, Kochi'],
      ['Kochi → Munnar', 'Wind up into the Western Ghats via the Cheeyappara and Valara waterfalls.', 'Breakfast, Dinner', 'Resort, Munnar'],
      ['Munnar sightseeing', 'Eravikulam National Park, the tea museum, Mattupetty dam and Echo Point.', 'Breakfast, Dinner', 'Resort, Munnar'],
      ['Munnar → Thekkady', 'Spice plantation walk and a boat ride on Periyar lake.', 'Breakfast, Dinner', 'Resort, Thekkady'],
      ['Thekkady → Alleppey houseboat', 'Board your private houseboat and cruise the backwaters with a Kerala lunch cooked on board.', 'All meals', 'Houseboat, Alleppey'],
      ['Departure', 'Disembark after breakfast and drive to Kochi airport.', 'Breakfast', '—']
    ],
    inc: ['4 nights resorts + 1 night private houseboat', 'Breakfast & dinner (all meals on houseboat)', 'Private AC cab', 'Kathakali show tickets', 'Airport transfers'],
    exc: ['Flights', 'Park entry fees', 'Lunches (except houseboat)', GST_NOTE],
    facts: { group: '2 – 10 travellers', best: 'Sep – Mar', start: 'Kochi airport', level: 'Easy' }
  },
  {
    id: 'goa-beach-holiday', title: 'Goa Beach Holiday', dest: 'goa', region: 'india',
    places: 'North Goa · Old Goa · Palolem', nights: 3, days: 4, price: 10999, old: 13499, rating: 4.6, reviews: 612,
    cats: ['Beach', 'Weekend'], badge: 'Weekend', cover: 'palolem',
    gallery: ['aguada', 'goa_shacks', 'bom_jesus', 'goa_loungers', 'goa_beach'],
    feats: ['stay', 'cab', 'meals', 'boat'],
    summary: 'Beach shacks, Portuguese churches and a sunset cruise — Goa, without the planning.',
    about: [
      'Three easy days of sun, sea and susegad. We cover the best of North Goa, the UNESCO churches of Old Goa and the palm-fringed crescent of Palolem in the south.',
      'Stay at a resort with a pool, ride with a private driver who knows the good shacks, and end each day with a sunset.'
    ],
    highlights: ['Fort Aguada & Candolim', 'Anjuna & Vagator sunsets', 'UNESCO churches of Old Goa', 'Palolem crescent beach', 'Mandovi sunset cruise', 'Resort with pool'],
    itinerary: [
      ['Arrive Goa', 'Airport pickup, check in and your first sunset at Candolim beach.', 'Dinner', 'Resort, North Goa'],
      ['North Goa tour', 'Fort Aguada, Calangute, Baga, Anjuna and Chapora fort for sunset.', 'Breakfast, Dinner', 'Resort, North Goa'],
      ['Old Goa & South Goa', 'Basilica of Bom Jesus and Se Cathedral, then Colva and Palolem. Evening Mandovi river cruise.', 'Breakfast, Dinner', 'Resort, North Goa'],
      ['Departure', 'A last swim, breakfast and airport drop.', 'Breakfast', '—']
    ],
    inc: ['3 nights in a 3★/4★ resort with pool', 'Breakfast & dinner', 'Private cab for sightseeing', 'Mandovi river cruise', 'Airport transfers'],
    exc: ['Flights', 'Water sports', 'Entry fees', GST_NOTE],
    facts: { group: '2 – 10 travellers', best: 'Nov – Feb', start: 'Goa airport', level: 'Easy' }
  },
  {
    id: 'andaman-island-escape', title: 'Andaman Island Escape', dest: 'andaman', region: 'india',
    places: 'Port Blair · Havelock · Neil', nights: 5, days: 6, price: 29999, old: 34999, rating: 4.9, reviews: 221,
    cats: ['Beach', 'Honeymoon'], badge: 'Trending', cover: 'havelock',
    gallery: ['andaman_sea', 'neil', 'havelock2', 'beach_sunset'],
    feats: ['stay', 'boat', 'meals', 'sight'],
    summary: 'Turquoise water, Radhanagar sunsets and snorkelling off Havelock — island time, sorted.',
    about: [
      "The Andamans are India's most beautiful secret: powder-white beaches, glassy water and coral reefs you can reach from the shore.",
      'We handle every ferry and transfer, so you just hop from Port Blair to Havelock and Neil with a beach-side resort waiting at the end of each ride.'
    ],
    highlights: ['Radhanagar beach sunset', 'Snorkelling at Elephant beach', 'Natural bridge at Neil island', 'Cellular Jail light & sound show', 'Private ferry tickets', 'Beach-side resort in Havelock'],
    itinerary: [
      ['Arrive Port Blair', "Corbyn's Cove beach and the moving light & sound show at the Cellular Jail.", 'Dinner', 'Hotel, Port Blair'],
      ['Port Blair → Havelock', "Cruise to Havelock (Swaraj Dweep). Sunset at Radhanagar, one of Asia's best beaches.", 'Breakfast, Dinner', 'Beach resort, Havelock'],
      ['Elephant beach', 'Speedboat to Elephant beach for snorkelling over coral reefs. Optional sea walk.', 'Breakfast, Dinner', 'Beach resort, Havelock'],
      ['Havelock → Neil', 'Ferry to Neil (Shaheed Dweep): Laxmanpur beach, the natural rock bridge and Bharatpur beach.', 'Breakfast, Dinner', 'Resort, Neil'],
      ['Neil → Port Blair', 'Return cruise and an evening at leisure in Port Blair.', 'Breakfast, Dinner', 'Hotel, Port Blair'],
      ['Departure', 'Airport drop after breakfast.', 'Breakfast', '—']
    ],
    inc: ['5 nights incl. beach resort in Havelock', 'Breakfast & dinner', 'Private cruise tickets (Port Blair ↔ Havelock ↔ Neil)', 'Elephant beach snorkelling', 'All transfers & sightseeing', 'Forest & entry permits'],
    exc: ['Flights to Port Blair', 'Scuba / sea walk', 'Lunches', GST_NOTE],
    facts: { group: '2 – 10 travellers', best: 'Oct – May', start: 'Port Blair', level: 'Easy' }
  },
  {
    id: 'rishikesh-rafting-camping', title: 'Rishikesh Rafting & Camping', dest: 'uttarakhand', region: 'india',
    places: 'Shivpuri · Rishikesh · Haridwar', nights: 2, days: 3, price: 6499, old: 7999, rating: 4.7, reviews: 389,
    cats: ['Adventure', 'Weekend', 'Spiritual'], badge: 'Weekend', cover: 'laxman_jhula',
    gallery: ['rishikesh', 'ganga_aarti', 'laxman_bridge', 'camp_night', 'tent_view'],
    feats: ['camp', 'raft', 'meals', 'sight'],
    summary: '16 km of Ganga rapids, a riverside camp with a bonfire and the evening aarti at Har Ki Pauri.',
    about: [
      'The perfect long weekend from Delhi. Sleep in Swiss tents on a white-sand beach by the Ganga, raft one of India\'s most fun stretches of river and soak in the spiritual side of Rishikesh.',
      'All rafting is run by certified guides with full safety gear — no swimming experience needed.'
    ],
    highlights: ['16 km white-water rafting (Grade III)', 'Riverside camp with bonfire', 'Cliff jumping & body surfing', 'Laxman Jhula & Beatles Ashram', 'Ganga aarti at Har Ki Pauri', 'Beach volleyball at camp'],
    itinerary: [
      ['Arrive at Shivpuri camp', 'Check in to Swiss tents on a white-sand beach. Volleyball, music and a bonfire under the stars.', 'Dinner', 'Riverside camp'],
      ['Rafting · Rishikesh town', 'Raft 16 km from Shivpuri with cliff jumping, then explore Laxman Jhula, cafés and the Beatles Ashram.', 'All meals', 'Riverside camp'],
      ['Haridwar aarti · departure', 'Drive to Haridwar for a dip and the Ganga aarti at Har Ki Pauri before heading home.', 'Breakfast', '—']
    ],
    inc: ['2 nights in Swiss tents', 'All meals from Day 1 dinner to Day 3 breakfast', '16 km rafting with certified guides & gear', 'Bonfire & music', 'Camp activities'],
    exc: ['Travel to Rishikesh', 'Bungee / flying fox', 'Personal expenses', GST_NOTE],
    facts: { group: '2 – 20 travellers', best: 'Sep – Jun', start: 'Shivpuri, Rishikesh', level: 'Easy · no swimming needed' }
  },
  {
    id: 'jim-corbett-jeep-safari', title: 'Jim Corbett Jeep Safari', dest: 'uttarakhand', region: 'india',
    places: 'Bijrani · Jhirna · Garjia · Ramnagar', nights: 2, days: 3, price: 8999, old: 10999, rating: 4.8, reviews: 274,
    cats: ['Wildlife', 'Weekend', 'Family'], badge: 'Jeep safari', cover: 'tiger_road',
    gallery: ['corbett_jhirna', 'peacock', 'gypsy_safari', 'jeep_forest', 'tiger'],
    feats: ['stay', 'jeep', 'meals', 'safari'],
    summary: "Two open-jeep safaris in India's oldest national park, with a jungle resort by the Kosi river.",
    about: [
      'Corbett is where India\'s tiger story began. We book the best zones for you — Bijrani for its grasslands and Jhirna for year-round sightings — with an experienced naturalist on every drive.',
      'Between safaris, relax at a jungle resort on the Kosi river, go bird-watching or visit the Garjia Devi temple that rises out of the river.'
    ],
    highlights: ['2 open-jeep safaris (Bijrani / Jhirna)', 'Naturalist-led game drives', 'Jungle resort by the Kosi river', 'Garjia Devi temple', 'Corbett waterfall', 'Bird-watching walk'],
    itinerary: [
      ['Arrive · jungle resort', 'Check in to a riverside jungle resort. Evening nature walk along the Kosi with a naturalist.', 'Dinner', 'Jungle resort'],
      ['Morning & evening jeep safaris', 'Sunrise game drive in Bijrani, rest at the resort, then an afternoon safari in Jhirna tracking tigers, elephants and deer.', 'All meals', 'Jungle resort'],
      ['Garjia temple · departure', 'Visit Garjia Devi temple and Corbett falls before heading back.', 'Breakfast', '—']
    ],
    inc: ['2 nights in a jungle resort', 'All meals', '2 jeep safaris with naturalist (Gypsy, up to 6)', 'Safari permits & park fees', 'Nature walk'],
    exc: ['Travel to Ramnagar', 'Private jeep upgrade', 'Camera fees', GST_NOTE],
    facts: { group: 'Up to 6 per jeep', best: 'Nov – Jun', start: 'Ramnagar', level: 'Easy · all ages' }
  },
  {
    id: 'dubai-delights', title: 'Dubai Delights with Desert Safari', dest: 'dubai', region: 'intl',
    places: 'Dubai · Marina · Desert · Abu Dhabi', nights: 4, days: 5, price: 54999, old: 62999, rating: 4.8, reviews: 433,
    cats: ['Family', 'Honeymoon', 'Luxury'], badge: 'Bestseller', cover: 'dubai',
    gallery: ['dubai_dunes', 'burj_al_arab', 'dubai_marina', 'dubai_canal', 'dubai_cruiser', 'hotel_night'],
    feats: ['stay', 'visa', 'jeep', 'sight'],
    summary: 'Burj Khalifa at sunset, a dhow dinner cruise and dune-bashing in a 4x4 across the Arabian desert.',
    about: [
      'Dubai does everything big — the tallest tower, the biggest mall and a desert that starts just 45 minutes from downtown.',
      'Your visa, transfers and tickets are all sorted before you land. Add Abu Dhabi for a day and you\'ve seen the best of the Emirates.'
    ],
    highlights: ['Burj Khalifa — 124th floor', '4x4 desert safari with BBQ dinner', 'Dhow cruise dinner, Dubai Marina', 'Abu Dhabi day trip & Grand Mosque', 'Dubai Mall & fountain show', 'UAE tourist visa included'],
    itinerary: [
      ['Arrive Dubai · dhow cruise', 'Airport pickup, hotel check-in and a dinner cruise on a traditional dhow along Dubai Marina.', 'Dinner', '4★ hotel, Dubai'],
      ['City tour & Burj Khalifa', 'Old Dubai, the gold & spice souks and an abra ride, then the 124th floor of Burj Khalifa and the Dubai Fountain.', 'Breakfast', '4★ hotel, Dubai'],
      ['Desert safari', 'Afternoon pickup in a 4x4 for dune bashing, sandboarding and a camel ride, then a BBQ dinner with live shows at a desert camp.', 'Breakfast, Dinner', '4★ hotel, Dubai'],
      ['Abu Dhabi day trip', 'Sheikh Zayed Grand Mosque, Qasr Al Watan photo stop and an optional visit to Ferrari World.', 'Breakfast', '4★ hotel, Dubai'],
      ['Departure', 'Last-minute shopping and airport drop.', 'Breakfast', '—']
    ],
    inc: ['4 nights in a 4★ hotel', 'Daily breakfast + 2 dinners', 'UAE tourist visa', 'Return airport transfers', 'Burj Khalifa (124th) tickets', '4x4 desert safari with BBQ dinner', 'Dhow cruise with dinner', 'Abu Dhabi tour (shared)'],
    exc: ['International flights', 'Tourism Dirham fee', 'Lunches', 'Optional tours', 'TCS & GST as applicable'],
    facts: { group: '2 – 20 travellers', best: 'Nov – Mar', start: 'Dubai airport', level: 'Easy' }
  },
  {
    id: 'bali-honeymoon', title: 'Bali Honeymoon Special', dest: 'bali', region: 'intl',
    places: 'Ubud · Kintamani · Nusa Penida · Seminyak', nights: 6, days: 7, price: 62999, old: 72999, rating: 4.9, reviews: 287,
    cats: ['Honeymoon', 'Beach'], badge: 'Honeymoon', cover: 'bali_temple',
    gallery: ['kelingking', 'bali_green', 'bali_sunset', 'infinity_pool', 'resort_palms'],
    feats: ['stay', 'cab', 'boat', 'sight'],
    summary: "Private pool villa in Ubud, sunset at Tanah Lot and Nusa Penida's famous Kelingking cliffs.",
    about: [
      'Bali was made for two. Start in the jungle calm of Ubud with a private pool villa, then move to the beaches of Seminyak for sunsets and beach clubs.',
      'We\'ve added the little things — flower-bed décor, a honeymoon cake and a candle-light dinner on the sand.'
    ],
    highlights: ['Private pool villa in Ubud', 'Bali swing & Tegallalang terraces', 'Kintamani volcano & coffee tasting', 'Nusa Penida — Kelingking beach', 'Tanah Lot sunset', 'Candle-light dinner on the beach'],
    itinerary: [
      ['Arrive Bali · Ubud villa', 'Airport welcome with flower garlands and transfer to your private pool villa in Ubud.', '—', 'Pool villa, Ubud'],
      ['Ubud highlights', 'Bali swing, Tegallalang rice terraces, Tegenungan waterfall and the Sacred Monkey Forest.', 'Breakfast', 'Pool villa, Ubud'],
      ['Kintamani volcano', 'Views of Mount Batur, coffee plantation tasting and the Tirta Empul water temple.', 'Breakfast', 'Pool villa, Ubud'],
      ['Ubud → Seminyak · Tanah Lot', 'Move to the beach and watch the sun set behind the sea temple of Tanah Lot.', 'Breakfast', 'Resort, Seminyak'],
      ['Nusa Penida day trip', "Fast boat to Nusa Penida: Kelingking beach, Angel's Billabong and Broken Beach.", 'Breakfast, Lunch', 'Resort, Seminyak'],
      ['Leisure · candle-light dinner', 'Spa, beach clubs or a lazy day — ending with a private candle-light dinner on the beach.', 'Breakfast, Dinner', 'Resort, Seminyak'],
      ['Departure', 'Breakfast and airport transfer.', 'Breakfast', '—']
    ],
    inc: ['3 nights private pool villa + 3 nights beach resort', 'Daily breakfast, 1 lunch & 1 candle-light dinner', 'Private transfers & sightseeing', 'Nusa Penida fast boat & tour', 'Honeymoon cake & décor'],
    exc: ['International flights', 'Indonesia visa on arrival', 'Entry fees', 'TCS & GST as applicable'],
    facts: { group: 'Couples', best: 'Apr – Oct', start: 'Denpasar airport', level: 'Easy' }
  },
  {
    id: 'thailand-phuket-krabi', title: 'Thailand — Phuket & Krabi', dest: 'thailand', region: 'intl',
    places: 'Phuket · Phi Phi · Krabi', nights: 5, days: 6, price: 45999, old: 52999, rating: 4.7, reviews: 366,
    cats: ['Beach', 'Honeymoon', 'Family'], badge: 'Trending', cover: 'phi_phi',
    gallery: ['thai_temple', 'thai_cliffs', 'beach_sunset', 'resort_pool'],
    feats: ['stay', 'boat', 'sight', 'meals'],
    summary: "Speedboat to Phi Phi, Krabi's limestone cliffs and island-hopping in the Andaman Sea.",
    about: [
      'Thailand\'s south is a postcard come to life — jade water, limestone towers and long-tail boats bobbing off white beaches.',
      'Split between Phuket and Krabi, this trip mixes island tours with easy evenings, street food and a little nightlife.'
    ],
    highlights: ['Phi Phi island speedboat tour', 'Maya Bay & Pileh lagoon', 'Krabi 4-island tour', 'Big Buddha & Old Phuket Town', 'Railay & Ao Nang beaches', '4★ hotels near the beach'],
    itinerary: [
      ['Arrive Phuket', 'Transfer to your hotel near Patong. Evening on Bangla Road.', '—', 'Hotel, Phuket'],
      ['Phi Phi islands', 'Full-day speedboat tour: Maya Bay, Pileh lagoon, Viking cave and snorkelling, with lunch.', 'Breakfast, Lunch', 'Hotel, Phuket'],
      ['Phuket city tour', 'Big Buddha, Wat Chalong, Old Phuket Town and Karon viewpoint.', 'Breakfast', 'Hotel, Phuket'],
      ['Phuket → Krabi', 'Drive to Krabi and spend the evening at Ao Nang beach.', 'Breakfast', 'Hotel, Krabi'],
      ['4-island tour', 'Long-tail boat to Phra Nang cave beach, Chicken island, Tup island and Poda.', 'Breakfast, Lunch', 'Hotel, Krabi'],
      ['Departure', 'Transfer to Krabi or Phuket airport.', 'Breakfast', '—']
    ],
    inc: ['5 nights in 4★ hotels', 'Daily breakfast + 2 lunches', 'Phi Phi & Krabi 4-island tours', 'All transfers (shared)', 'Phuket city tour'],
    exc: ['International flights', 'Visa (if applicable)', 'National park fees', 'TCS & GST as applicable'],
    facts: { group: '2 – 20 travellers', best: 'Nov – Apr', start: 'Phuket airport', level: 'Easy' }
  },
  {
    id: 'maldives-overwater', title: 'Maldives Overwater Escape', dest: 'maldives', region: 'intl',
    places: 'Malé · Private island resort', nights: 4, days: 5, price: 89999, old: 104999, rating: 4.9, reviews: 158,
    cats: ['Honeymoon', 'Beach', 'Luxury'], badge: 'Luxury', cover: 'maldives',
    gallery: ['maldives_villas', 'maldives_island', 'infinity_pool', 'beach_sunset'],
    feats: ['stay', 'boat', 'meals', 'sight'],
    summary: 'Two nights on the beach, two in an overwater villa — with dolphins, reefs and a sandbank picnic.',
    about: [
      'Wake up above a lagoon so clear you can see the reef from your deck. We split your stay between a beach villa and an overwater villa for the best of both.',
      'Speedboat transfers, half-board meals and two signature experiences are included, so the only decision left is sunset or stargazing.'
    ],
    highlights: ['Overwater villa with lagoon access', 'Speedboat transfers', 'Sunset dolphin cruise', 'House-reef snorkelling', 'Private sandbank picnic', 'Half-board meal plan'],
    itinerary: [
      ['Arrive Malé · beach villa', 'Speedboat to your island resort and check in to a beach villa.', 'Dinner', 'Beach villa'],
      ['Snorkel & dolphin cruise', 'Snorkel the house reef, then a sunset cruise to spot spinner dolphins.', 'Breakfast, Dinner', 'Beach villa'],
      ['Overwater villa', 'Move into your overwater villa. Spa, kayaking or simply the lagoon.', 'Breakfast, Dinner', 'Overwater villa'],
      ['Sandbank picnic', 'A private sandbank picnic in the middle of the Indian Ocean.', 'Breakfast, Dinner', 'Overwater villa'],
      ['Departure', 'Breakfast and speedboat back to Malé.', 'Breakfast', '—']
    ],
    inc: ['2 nights beach villa + 2 nights overwater villa', 'Half board (breakfast & dinner)', 'Return speedboat transfers', 'Sunset dolphin cruise', 'Sandbank picnic', 'Green tax & service charges'],
    exc: ['International flights', 'Water sports & diving', 'Beverages', 'TCS & GST as applicable'],
    facts: { group: 'Couples & families', best: 'Nov – Apr', start: 'Malé airport', level: 'Easy' }
  },
  {
    id: 'kenya-masai-mara', title: 'Kenya — Masai Mara Safari', dest: 'kenya', region: 'intl',
    places: 'Nairobi · Masai Mara · Lake Naivasha', nights: 5, days: 6, price: 149999, old: 169999, rating: 4.9, reviews: 96,
    cats: ['Wildlife', 'Adventure'], badge: 'Big Five', cover: 'safari_sunset',
    gallery: ['giraffe', 'elephant', 'acacia', 'elephants_dusk'],
    feats: ['stay', 'jeep', 'meals', 'safari'],
    summary: 'Game drives in a 4x4 pop-up jeep across the Mara — lions, elephants and, in season, the Great Migration.',
    about: [
      'The Masai Mara is the safari you\'ve seen in documentaries — endless savannah, flat-topped acacias and more wildlife than you can count.',
      'You\'ll explore in a 4x4 pop-up roof jeep with a driver-guide, sleep in a tented camp inside the reserve and finish with a boat safari among hippos on Lake Naivasha.'
    ],
    highlights: ['3 days of game drives in a pop-up jeep', 'Chance to see the Big Five', 'Great Migration (Jul – Oct)', 'Tented camp in the Mara', 'Boat safari on Lake Naivasha', 'Giraffe Centre, Nairobi'],
    itinerary: [
      ['Arrive Nairobi', 'Meet & greet, transfer to your hotel and an evening briefing with your safari guide.', 'Dinner', 'Hotel, Nairobi'],
      ['Nairobi → Masai Mara', 'Drive through the Great Rift Valley to the Mara. Afternoon game drive.', 'All meals', 'Tented camp, Mara'],
      ['Full day in the Mara', 'Full-day game drive with a picnic lunch by the Mara river — home of the famous crossings.', 'All meals', 'Tented camp, Mara'],
      ['Mara → Lake Naivasha', 'Morning game drive, then on to Lake Naivasha for a boat safari among hippos.', 'All meals', 'Lodge, Naivasha'],
      ['Naivasha → Nairobi', 'Back to Nairobi via the Giraffe Centre.', 'Breakfast, Dinner', 'Hotel, Nairobi'],
      ['Departure', 'Transfer to Jomo Kenyatta airport.', 'Breakfast', '—']
    ],
    inc: ['5 nights incl. 2 in a Mara tented camp', 'Full board on safari', '4x4 pop-up roof jeep with driver-guide', 'Park entry fees', 'Lake Naivasha boat ride', 'Airport transfers'],
    exc: ['International flights', 'Kenya eTA', 'Hot-air balloon safari', 'Tips', 'TCS & GST as applicable'],
    facts: { group: 'Up to 6 per jeep', best: 'Jul – Oct', start: 'Nairobi airport', level: 'Easy' }
  },
  {
    id: 'swiss-paris', title: 'Swiss Alps & Paris', dest: 'europe', region: 'intl',
    places: 'Paris · Lucerne · Interlaken · Jungfraujoch', nights: 7, days: 8, price: 179999, old: 199999, rating: 4.8, reviews: 142,
    cats: ['Honeymoon', 'Family', 'Luxury'], badge: 'Europe', cover: 'swiss_alps',
    gallery: ['swiss_valley', 'eiffel', 'snow_peaks', 'peak_dusk'],
    feats: ['stay', 'train', 'sight', 'visa'],
    summary: 'The Eiffel Tower, a lake cruise in Lucerne and the Top of Europe at Jungfraujoch — all by train.',
    about: [
      'Two icons in one trip: Paris for the boulevards and the Eiffel Tower, then Switzerland for lakes, glaciers and cogwheel trains.',
      'Your Swiss Travel Pass covers trains, boats and buses, and we add three Indian dinners for the evenings you miss home.'
    ],
    highlights: ['Eiffel Tower 2nd level & Seine cruise', 'TGV Paris → Switzerland', 'Mt. Titlis & Lake Lucerne', 'Jungfraujoch — Top of Europe', 'Swiss Travel Pass included', 'Indian dinners on select days'],
    itinerary: [
      ['Arrive Paris', 'Transfer to your hotel. Evening Seine river cruise.', '—', 'Hotel, Paris'],
      ['Paris city tour', 'Eiffel Tower (2nd level), Arc de Triomphe, Champs-Élysées and the Louvre (outside).', 'Breakfast', 'Hotel, Paris'],
      ['Disneyland or Versailles', 'Choose a day at Disneyland Paris or the Palace of Versailles.', 'Breakfast', 'Hotel, Paris'],
      ['Paris → Lucerne', 'TGV to Switzerland, a lakeside walk and the Chapel Bridge in Lucerne.', 'Breakfast, Dinner', 'Hotel, Lucerne'],
      ['Mt. Titlis', 'Rotair cable car to the glacier at Mt. Titlis, the ice flyer and the cliff walk.', 'Breakfast', 'Hotel, Lucerne'],
      ['Lucerne → Interlaken', 'GoldenPass scenic line to Interlaken, with time for Harder Kulm.', 'Breakfast', 'Hotel, Interlaken'],
      ['Jungfraujoch', 'Cogwheel railway to the Top of Europe — Sphinx observatory and the ice palace.', 'Breakfast, Dinner', 'Hotel, Interlaken'],
      ['Departure', 'Train to Zurich airport.', 'Breakfast', '—']
    ],
    inc: ['7 nights in 3★/4★ hotels', 'Daily breakfast + 3 Indian dinners', 'Swiss Travel Pass (4 days)', 'TGV Paris → Basel', 'Mt. Titlis & Jungfraujoch tickets', 'Seine cruise & Paris city tour', 'Schengen visa assistance'],
    exc: ['International flights', 'Visa fees', 'City taxes', 'Lunches', 'TCS & GST as applicable'],
    facts: { group: '2 – 20 travellers', best: 'May – Sep', start: 'Paris airport', level: 'Easy' }
  }
];

/* ---------- Jeep safaris ---------- */
const SAFARIS = [
  { id: 'corbett', name: 'Jim Corbett', area: 'Uttarakhand · Bijrani / Jhirna / Dhela', img: 'corbett_jhirna', price: 5500, note: "India's oldest national park — tigers, elephants & 600+ bird species.", badge: 'Tiger country', season: 'Open 15 Oct – 30 Jun' },
  { id: 'bandhavgarh', name: 'Bandhavgarh', area: 'Madhya Pradesh · Tala / Magadhi', img: 'gypsy_safari', price: 6500, note: 'Highest density of tigers in India, set around an ancient hill fort.', badge: 'Best sightings', season: 'Open 1 Oct – 30 Jun' },
  { id: 'kaziranga', name: 'Kaziranga', area: 'Assam · Central (Kohora) range', img: 'kaziranga', price: 4800, note: "Home to two-thirds of the world's one-horned rhinos.", badge: 'Rhino land', season: 'Open 1 Nov – 30 Apr' },
  { id: 'ranthambore', name: 'Ranthambore', area: 'Rajasthan · Zones 1 – 10', img: 'tiger', price: 5200, note: 'Tigers among fort ruins and lakes — a photographer favourite.', badge: 'Photographer pick', season: 'Open 1 Oct – 30 Jun' },
  { id: 'sam-dunes', name: 'Sam Sand Dunes', area: 'Jaisalmer, Rajasthan', img: 'camel_dunes', price: 3500, note: 'Dune-bashing in an open 4x4 and a camel ride into the sunset.', badge: 'Desert thrill', season: 'Best Oct – Mar', slots: [['sunrise', 'Sunrise', '6:30 – 8:30 AM'], ['sunset', 'Sunset', '4:30 – 7:00 PM']] }
];
const SAFARI_SLOTS = [['morning', 'Morning', '6:00 – 9:30 AM'], ['evening', 'Evening', '2:30 – 6:00 PM']];

/* ---------- Cabs & SUVs ---------- */
const VEHICLES = [
  { id: 'sedan', name: 'Sedan', model: 'Swift Dzire or similar', icon: 'ri-taxi-line', seats: 4, bags: 2, rate: 12, local: 2200, allowance: 400 },
  { id: 'suv', name: 'SUV', model: 'Innova Crysta or similar', icon: 'ri-car-line', seats: 6, bags: 4, rate: 18, local: 3200, allowance: 400, badge: 'Most booked' },
  { id: 'thar', name: 'Mahindra Thar 4x4', model: 'Open-top · hill & desert ready', jeep: true, seats: 4, bags: 1, rate: 20, local: 3800, allowance: 400, badge: 'Off-road' },
  { id: 'tempo', name: 'Tempo Traveller', model: '12-seater · push-back seats', icon: 'ri-bus-2-line', seats: 12, bags: 10, rate: 26, local: 4500, allowance: 500 }
];
const CITIES = {
  'Delhi': [28.61, 77.21], 'Gurugram': [28.46, 77.03], 'Chandigarh': [30.73, 76.78], 'Amritsar': [31.63, 74.87], 'Shimla': [31.10, 77.17],
  'Manali': [32.24, 77.19], 'Dharamshala': [32.22, 76.32], 'Dehradun': [30.32, 78.03], 'Mussoorie': [30.46, 78.07], 'Rishikesh': [30.09, 78.27],
  'Haridwar': [29.95, 78.16], 'Nainital': [29.38, 79.46], 'Jim Corbett': [29.39, 79.13], 'Agra': [27.18, 78.01], 'Jaipur': [26.91, 75.79],
  'Jodhpur': [26.24, 73.02], 'Udaipur': [24.59, 73.71], 'Jaisalmer': [26.92, 70.91], 'Srinagar': [34.08, 74.80], 'Leh': [34.15, 77.58],
  'Lucknow': [26.85, 80.95], 'Varanasi': [25.32, 82.97], 'Mumbai': [19.08, 72.88], 'Pune': [18.52, 73.86], 'Goa': [15.49, 73.83],
  'Bengaluru': [12.97, 77.59], 'Mysuru': [12.30, 76.64], 'Coorg': [12.42, 75.74], 'Ooty': [11.41, 76.70], 'Kochi': [9.93, 76.27],
  'Munnar': [10.09, 77.06], 'Chennai': [13.08, 80.27], 'Hyderabad': [17.39, 78.49], 'Kolkata': [22.57, 88.36], 'Darjeeling': [27.04, 88.26], 'Gangtok': [27.33, 88.61]
};

/* ---------- Social proof ---------- */
const TESTIMONIALS = [
  { name: 'Aanya & Rohit Sharma', city: 'New Delhi', trip: 'Ladakh Jeep Expedition', rating: 5, text: 'Best decision of the year. Our driver knew every viewpoint, the camps were spotless and Pangong at sunrise — I still can\'t believe it was real.' },
  { name: 'Priya Menon', city: 'Bengaluru', trip: 'Bali Honeymoon Special', rating: 5, text: 'Planned our honeymoon in two calls. The pool villa was stunning and the candle-light dinner was a lovely surprise. Zero stress from start to finish.' },
  { name: 'Karan Malhotra', city: 'Chandigarh', trip: 'Kashmir — Paradise on Earth', rating: 5, text: 'Took my parents to Kashmir. Everything was paced for them — no rushed mornings, great food, and the houseboat night was their favourite part.' },
  { name: 'Sneha Kulkarni', city: 'Pune', trip: 'Jim Corbett Jeep Safari', rating: 5, text: 'Two brilliant safari drives and we saw a tigress on the second day! The naturalist was superb with the kids.' },
  { name: 'Arjun Nair', city: 'Kochi', trip: 'Dubai Delights', rating: 4, text: 'Nine friends, zero chaos. The desert safari was insane and the hotel location was spot on. Would book again.' },
  { name: 'Meera Iyer', city: 'Chennai', trip: 'Royal Rajasthan & Thar Desert', rating: 5, text: 'We customised the route with an extra day in Jaisalmer. The desert camp and folk evening were pure magic.' }
];

const REVIEW_POOL = [
  { name: 'Rahul Verma', city: 'Gurugram', rating: 5, text: 'Everything in {place} was exactly as promised — clean stays, a punctual driver and a trip captain who genuinely cared. Worth every rupee.' },
  { name: 'Ishita Das', city: 'Kolkata', rating: 5, text: 'The itinerary had the right balance of sightseeing and downtime. Loved that we could tweak plans on WhatsApp in real time.' },
  { name: 'Harpreet Kaur', city: 'Ludhiana', rating: 4, text: 'Great experience overall. One hotel was a little basic, but the team upgraded our room the next night without us even asking.' },
  { name: 'Nikhil Joshi', city: 'Indore', rating: 5, text: 'Booked last-minute and still got a fantastic deal. The 25% part-payment option made it so easy.' },
  { name: 'Zoya Ali', city: 'Hyderabad', rating: 5, text: 'Our guide knew {place} like the back of his hand — hidden cafés, quiet viewpoints, the works. Already planning the next one!' },
  { name: 'Vikram Rathore', city: 'Jaipur', rating: 4, text: 'Smooth transfers and good food. Would have liked one more free evening, but the team was flexible about it.' }
];

const FAQS = [
  ['How do I confirm my booking?', 'Choose your date and travellers, pay 25% (or the full amount) online and you get an instant e-voucher on email and WhatsApp. The balance is due 15 days before departure.'],
  ['What is the cancellation policy?', 'Free cancellation up to 15 days before departure. 50% refund between 14 and 7 days, and no refund within 7 days of travel. Refunds reach your account in 5 – 7 working days.'],
  ['Can I customise the itinerary?', 'Absolutely. Add nights, upgrade hotels, change the pace or add activities — mention it in the booking form or use Plan My Trip and a trip designer will call you.'],
  ['Are flights included?', 'Packages are land-only unless mentioned. Tell us your city and we will add the best available fares at the time of booking.'],
  ['Is it safe for solo and women travellers?', 'Yes. We use verified drivers and stays, share live trip details with you, and our 24×7 support line is always one call away.'],
  ['Do you offer EMI?', 'Yes — no-cost EMI is available on select credit cards for bookings above ₹10,000.']
];
