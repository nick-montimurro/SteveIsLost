import { Country } from '../types';

/**
 * Sprite Mapping System
 * 
 * Maps NPC roles to their sprite image files. Uses a fallback chain:
 * 1. Country-specific + exact role match
 * 2. Generic role match
 * 3. Category fallback
 * 4. Default placeholder
 */

// Role categories for fallback matching
const ROLE_CATEGORIES: Record<string, string[]> = {
  'barkeeper': ['barkeep', 'bartender', 'barista', 'bar', 'door guy', 'door_guy'],
  'transport': ['bus driver', 'bus_driver', 'coach driver', 'coach_driver', 'taxi driver', 'taxi_driver', 'gondolier', 'vespa driver', 'vespa_driver', 'tram driver', 'tram_driver', 'limosine driver', 'limosine_driver'],
  'vendor': ['churros vendor', 'churros_vendor', 'cinnamon bun baker', 'cinnamon_bun_baker', 'pretzel baker', 'pretzel_baker', 'pretzel hawker', 'pretzel_hawker', 'gelato vendor', 'gelato_vendor', 'pizza chef', 'pizza_chef', 'pizza maker', 'pizza_maker', 'sausage vendor', 'sausage_vendor', 'market vendor', 'market_vendor', 'market trader', 'market_trader', 'souvenir seller', 'souvenir_seller', 'souvenir guy', 'souvenir_guy'],
  'musician': ['street musician', 'street_musician', 'street performer', 'street_performer', 'club dj', 'club_dj'],
  'elder': ['old lady', 'old_lady', 'nonna', 'local grandmother', 'local_grandmother', 'old fisherman', 'old_fisherman', 'shepherd'],
  'authority': ['local cop', 'local_cop', 'border officer', 'border_officer', 'customs officer', 'customs_officer', 'customs inspector', 'customs_inspector', 'border guard', 'border_guard', 'beach patrol', 'beach_patrol', 'tsa officer', 'tsa_officer', 'bouncer'],
  'ticket': ['ticket seller', 'ticket_seller', 'ticket agent', 'ticket_agent', 'ticket clerk', 'ticket_clerk', 'stationmaster', 'station director', 'station_director', 'station clerk', 'station_clerk', 'station master', 'station_master'],
  'cafe': ['cafe owner', 'cafe_owner', 'cafe cashier', 'cafe_cashier', 'biergarten waitress', 'biergarten_waitress', 'diner waitress', 'diner_waitress', 'spray tanner', 'spray_tanner'],
  'accommodation': ['hostel desk clerk', 'hostel_desk_clerk', 'hostel clerk', 'hostel_clerk', 'hostel receptionist', 'hostel_receptionist', 'hotel desk clerk', 'hotel_desk_clerk', 'ikea clerk', 'ikea_clerk'],
  'museum': ['museum guard', 'museum_guard', 'museum guide', 'museum_guide', 'museum attendant', 'museum_attendant'],
  'airport': ['airport info desk', 'airport_info_desk', 'airport desk clerk', 'airport_desk_clerk', 'airport information', 'airport_information', 'airport skycap', 'airport_skycap'],
  'gate': ['gate agent', 'gate_agent', 'flight attendant', 'flight_attendant'],
  'pilot': ['pilot', 'co-pilot', 'co_pilot'],
  'jersey_character': ['the situation', 'the_situation', 'boardwalk queen', 'boardwalk_queen', 'taxi passenger', 'taxi_passenger', 'moose herder', 'moose_herder'],
};

// Country-specific sprite file mappings (what we actually have on disk)
const COUNTRY_SPRITES: Record<string, string> = {
  // Spain
  'spain_barkeep': '/assets/images/npcs/spain_barkeep.png',
  'spain_bus_driver': '/assets/images/npcs/spain_busdriver.png',
  
  // Italy
  'italy_barista': '/assets/images/npcs/italy_barista.png',
  
  // Germany
  'germany_barkeep': '/assets/images/npcs/germany_barkeep.png',
  
  // Sweden
  'sweden_barista': '/assets/images/npcs/sweden_barista.png',
  
  // Romania
  'romania_barkeep': '/assets/images/npcs/romania_barkeep.png',
  
  // Jersey Shore
  'jersey_shore_door_guy': '/assets/images/npcs/jersey_door.png',
};

// Generic role sprites (generated assets that work for any country)
const GENERIC_ROLE_SPRITES: Record<string, string> = {
  'barkeeper': '/assets/images/npcs/generic_barkeeper.png',
  'transport': '/assets/images/npcs/generic_driver.png',
  'vendor': '/assets/images/npcs/generic_vendor.png',
  'musician': '/assets/images/npcs/generic_musician.png',
  'elder': '/assets/images/npcs/generic_elder.png',
  'authority': '/assets/images/npcs/generic_authority.png',
  'ticket': '/assets/images/npcs/generic_ticket.png',
  'cafe': '/assets/images/npcs/generic_cafe.png',
  'accommodation': '/assets/images/npcs/generic_hostel.png',
  'museum': '/assets/images/npcs/generic_museum.png',
  'airport': '/assets/images/npcs/generic_airport.png',
  'gate': '/assets/images/npcs/generic_gate.png',
  'pilot': '/assets/images/npcs/generic_pilot.png',
  'jersey_character': '/assets/images/npcs/jersey_door.png',
};

/**
 * Resolves the sprite image path for an NPC given their country and role.
 * Uses a 3-tier fallback:
 * 1. Country-specific sprite (e.g., spain_barkeep.png)
 * 2. Generic role sprite (e.g., generic_driver.png)
 * 3. Default placeholder
 */
export function resolveSprite(country: Country, role: string): string {
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  const normalizedCountry = country.toLowerCase().replace(/\s+/g, '_');
  
  // 1. Try exact country+role match
  const countryRoleKey = `${normalizedCountry}_${normalizedRole}`;
  if (COUNTRY_SPRITES[countryRoleKey]) {
    return COUNTRY_SPRITES[countryRoleKey];
  }
  
  // 2. Try finding the role category
  const category = findRoleCategory(normalizedRole);
  if (category) {
    // Try country-specific category sprite
    const countryCategory = `${normalizedCountry}_${category}`;
    if (COUNTRY_SPRITES[countryCategory]) {
      return COUNTRY_SPRITES[countryCategory];
    }
    // Try generic category sprite
    if (GENERIC_ROLE_SPRITES[category]) {
      return GENERIC_ROLE_SPRITES[category];
    }
  }
  
  // 3. Fallback: Try matching the first word of the role to available country sprites
  const firstWord = normalizedRole.split('_')[0];
  for (const [key, path] of Object.entries(COUNTRY_SPRITES)) {
    if (key.startsWith(normalizedCountry) && key.includes(firstWord)) {
      return path;
    }
  }
  
  // 4. Final fallback to the country's barkeeper/first NPC sprite  
  const countryBarkeep = `${normalizedCountry}_barkeep`;
  const countryBarista = `${normalizedCountry}_barista`;
  if (COUNTRY_SPRITES[countryBarkeep]) return COUNTRY_SPRITES[countryBarkeep];
  if (COUNTRY_SPRITES[countryBarista]) return COUNTRY_SPRITES[countryBarista];
  
  // 5. Absolute fallback
  return '/assets/images/npcs/spain_barkeep.png';
}

function findRoleCategory(normalizedRole: string): string | null {
  for (const [category, roles] of Object.entries(ROLE_CATEGORIES)) {
    if (roles.includes(normalizedRole)) {
      return category;
    }
    // Partial match — check if any role keyword is contained in the normalized role
    for (const r of roles) {
      if (normalizedRole.includes(r.replace(/\s+/g, '_')) || r.replace(/\s+/g, '_').includes(normalizedRole)) {
        return category;
      }
    }
  }
  return null;
}

/** Journey stage backgrounds per country */
export function resolveLocationBg(country: Country, stageIndex: number): string {
  const normalizedCountry = country.toLowerCase().replace(/\s+/g, '_');
  // We have limited backgrounds, so cycle through what's available
  const maxBgs: Record<string, number> = {
    'spain': 3,      // spain_0, spain_1, spain_2
    'italy': 1,       // italy_0
    'germany': 1,     // germany_0
    'sweden': 1,      // sweden_0
    'romania': 1,     // romania_0
    'jersey_shore': 1  // jersey_shore_0
  };
  
  const available = maxBgs[normalizedCountry] || 1;
  const bgIndex = stageIndex % available;
  
  return `/assets/images/locations/${normalizedCountry}_${bgIndex}.png`;
}
