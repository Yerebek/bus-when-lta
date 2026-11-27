import {
  BusArrivalResponse,
  BusLoad,
  BusOperator,
  BusRouteSummary,
  BusServiceArrival,
  BusStop,
  BusType,
  NextBusSlot,
} from '../types/bus';

export const SINGAPORE_BUS_STOPS: BusStop[] = [
  {
    BusStopCode: '09047',
    RoadName: 'Orchard Rd',
    Description: 'Opp Orchard Stn / ION',
    Latitude: 1.3041,
    Longitude: 103.8318,
    Region: 'Central',
    NearbyMRT: 'NS22 / TE14 Orchard',
    Services: ['7', '14', '16', '36', '65', '77', '106', '111', '124', '143', '167', '174', '175', '190', '502', '972'],
  },
  {
    BusStopCode: '09048',
    RoadName: 'Orchard Blvd',
    Description: 'Orchard Stn Exit 13',
    Latitude: 1.3032,
    Longitude: 103.8312,
    Region: 'Central',
    NearbyMRT: 'NS22 / TE14 Orchard',
    Services: ['7', '14', '16', '77', '106', '111', '174', '175', '972'],
  },
  {
    BusStopCode: '01012',
    RoadName: 'Victoria St',
    Description: 'Hotel Grand Pacific',
    Latitude: 1.2968,
    Longitude: 103.8525,
    Region: 'Central',
    NearbyMRT: 'CC2 Bras Basah / EW12 Bugis',
    Services: ['2', '7', '12', '32', '33', '51', '61', '63', '80', '130', '133', '145', '175', '197'],
  },
  {
    BusStopCode: '01113',
    RoadName: 'Victoria St',
    Description: 'Bugis Stn Exit B',
    Latitude: 1.3005,
    Longitude: 103.8561,
    Region: 'Central',
    NearbyMRT: 'EW12 / DT14 Bugis',
    Services: ['2', '7', '12', '32', '33', '51', '61', '63', '80', '130', '133', '145', '175', '197'],
  },
  {
    BusStopCode: '03211',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands Theatre',
    Latitude: 1.2856,
    Longitude: 103.8602,
    Region: 'Central',
    NearbyMRT: 'CE1 / DT16 Bayfront',
    Services: ['97', '106', '133', '502', '518'],
  },
  {
    BusStopCode: '03019',
    RoadName: 'Raffles Quay',
    Description: 'One Raffles Quay',
    Latitude: 1.2811,
    Longitude: 103.8518,
    Region: 'Central',
    NearbyMRT: 'DT18 Telok Ayer / EW14 Raffles Place',
    Services: ['10', '57', '70', '100', '107', '130', '131', '167', '196', '970'],
  },
  {
    BusStopCode: '08057',
    RoadName: 'Orchard Rd',
    Description: 'Dhoby Ghaut Stn / Plaza Singapura',
    Latitude: 1.2999,
    Longitude: 103.8451,
    Region: 'Central',
    NearbyMRT: 'NS24 / NE6 / CC1 Dhoby Ghaut',
    Services: ['7', '14', '16', '36', '65', '77', '106', '111', '124', '167', '174', '175', '190'],
  },
  {
    BusStopCode: '14141',
    RoadName: 'Telok Blangah Rd',
    Description: 'VivoCity / HarbourFront Stn',
    Latitude: 1.2647,
    Longitude: 103.8224,
    Region: 'Central',
    NearbyMRT: 'NE1 / CC29 HarbourFront',
    Services: ['10', '30', '57', '61', '65', '80', '93', '97', '100', '131', '143', '145', '166', '188'],
  },
  {
    BusStopCode: '11161',
    RoadName: 'North Buona Vista Rd',
    Description: 'Buona Vista Stn Exit C',
    Latitude: 1.3071,
    Longitude: 103.7902,
    Region: 'West',
    NearbyMRT: 'EW21 / CC22 Buona Vista',
    Services: ['74', '91', '92', '95', '100', '105', '106', '111', '147', '185', '191', '196', '198', '200'],
  },
  {
    BusStopCode: '17009',
    RoadName: 'Clementi Ave 3',
    Description: 'Clementi Bus Interchange',
    Latitude: 1.3149,
    Longitude: 103.7644,
    Region: 'West',
    NearbyMRT: 'EW23 Clementi',
    Services: ['7', '14', '52', '78', '96', '105', '106', '147', '154', '156', '165', '166', '175', '184', '185', '189'],
  },
  {
    BusStopCode: '28009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Bus Interchange',
    Latitude: 1.3335,
    Longitude: 103.7418,
    Region: 'West',
    NearbyMRT: 'EW24 / NS1 Jurong East',
    Services: ['41', '49', '51', '52', '66', '78', '79', '97', '98', '105', '143', '160', '183', '197', '333', '334', '335'],
  },
  {
    BusStopCode: '21009',
    RoadName: 'Boon Lay Way',
    Description: 'Boon Lay Bus Interchange',
    Latitude: 1.3389,
    Longitude: 103.7058,
    Region: 'West',
    NearbyMRT: 'EW27 Boon Lay',
    Services: ['30', '79', '154', '157', '172', '174', '178', '179', '180', '181', '182', '187', '192', '193', '194', '198', '199'],
  },
  {
    BusStopCode: '43009',
    RoadName: 'Bukit Batok Central',
    Description: 'Bukit Batok Bus Interchange',
    Latitude: 1.3492,
    Longitude: 103.7501,
    Region: 'West',
    NearbyMRT: 'NS2 Bukit Batok',
    Services: ['61', '66', '77', '106', '157', '173', '177', '189', '852', '941', '945', '947', '990'],
  },
  {
    BusStopCode: '75009',
    RoadName: 'Tampines Central 1',
    Description: 'Tampines Bus Interchange',
    Latitude: 1.3541,
    Longitude: 103.9436,
    Region: 'East',
    NearbyMRT: 'EW2 / DT32 Tampines',
    Services: ['3', '4', '8', '10', '19', '20', '22', '23', '28', '29', '31', '37', '38', '65', '67', '69', '72', '81', '127', '291', '292', '293'],
  },
  {
    BusStopCode: '84009',
    RoadName: 'Bedok North Dr',
    Description: 'Bedok Bus Interchange',
    Latitude: 1.3247,
    Longitude: 103.9296,
    Region: 'East',
    NearbyMRT: 'EW5 Bedok',
    Services: ['7', '9', '14', '16', '17', '18', '25', '26', '30', '32', '33', '35', '38', '40', '66', '69', '87', '168', '196', '197', '222', '225', '228', '229'],
  },
  {
    BusStopCode: '81009',
    RoadName: 'Paya Lebar Rd',
    Description: 'Paya Lebar Stn Exit B',
    Latitude: 1.3177,
    Longitude: 103.8926,
    Region: 'East',
    NearbyMRT: 'EW8 / CC9 Paya Lebar',
    Services: ['2', '7', '13', '21', '24', '26', '28', '30', '40', '43', '51', '67', '70', '76', '134', '135', '154', '155', '197'],
  },
  {
    BusStopCode: '95129',
    RoadName: 'Airport Blvd',
    Description: 'Changi Airport Terminal 1',
    Latitude: 1.3612,
    Longitude: 103.9901,
    Region: 'East',
    NearbyMRT: 'CG2 Changi Airport',
    Services: ['24', '27', '34', '36', '53', '110', '858'],
  },
  {
    BusStopCode: '46009',
    RoadName: 'Woodlands Sq',
    Description: 'Woodlands Integrated Transport Hub',
    Latitude: 1.4371,
    Longitude: 103.7863,
    Region: 'North',
    NearbyMRT: 'NS9 / TE2 Woodlands',
    Services: ['161', '168', '169', '178', '187', '856', '858', '900', '901', '902', '903', '904', '911', '912', '913', '925', '926', '950', '960', '961', '962', '963', '964', '965', '966', '969'],
  },
  {
    BusStopCode: '59009',
    RoadName: 'Yishun Ave 2',
    Description: 'Yishun Integrated Transport Hub',
    Latitude: 1.4285,
    Longitude: 103.8359,
    Region: 'North',
    NearbyMRT: 'NS13 Yishun',
    Services: ['39', '85', '103', '117', '169', '171', '800', '801', '803', '804', '805', '806', '807', '811', '812', '851', '852', '853', '854', '855', '856', '857', '858', '859', '860', '883', '965', '969'],
  },
  {
    BusStopCode: '53009',
    RoadName: 'Bishan Pl',
    Description: 'Bishan Bus Interchange',
    Latitude: 1.3502,
    Longitude: 103.8489,
    Region: 'North',
    NearbyMRT: 'NS17 / CC15 Bishan',
    Services: ['50', '52', '53', '54', '55', '56', '57', '58', '59', '410'],
  },
  {
    BusStopCode: '66009',
    RoadName: 'Serangoon Central',
    Description: 'Serangoon Bus Interchange',
    Latitude: 1.3502,
    Longitude: 103.8727,
    Region: 'North-East',
    NearbyMRT: 'NE12 / CC13 Serangoon',
    Services: ['22', '43', '45', '53', '58', '70', '81', '82', '100', '101', '103', '105', '107', '109', '133', '135', '147', '153', '158', '315', '317'],
  },
  {
    BusStopCode: '65009',
    RoadName: 'Sengkang Sq',
    Description: 'Sengkang Bus Interchange',
    Latitude: 1.3917,
    Longitude: 103.8958,
    Region: 'North-East',
    NearbyMRT: 'NE16 / STC Sengkang',
    Services: ['27', '43', '80', '82', '83', '86', '87', '88', '89', '102', '109', '110', '119', '136', '156', '159', '161', '163', '371', '372', '374'],
  },
  {
    BusStopCode: '65239',
    RoadName: 'Punggol Pl',
    Description: 'Punggol Temp Interchange',
    Latitude: 1.4046,
    Longitude: 103.9022,
    Region: 'North-East',
    NearbyMRT: 'NE17 / PTC Punggol',
    Services: ['3', '34', '39', '43', '50', '62', '82', '83', '84', '85', '117', '118', '119', '136', '381', '382', '384', '386'],
  },
];

const SERVICE_OPERATORS: Record<string, BusOperator> = {
  '2': 'SBST',
  '3': 'SBST',
  '7': 'SBST',
  '10': 'SBST',
  '12': 'SBST',
  '14': 'SBST',
  '16': 'SBST',
  '22': 'SBST',
  '24': 'SBST',
  '27': 'SBST',
  '30': 'SBST',
  '32': 'SBST',
  '33': 'SBST',
  '34': 'SBST',
  '36': 'GAS',
  '39': 'SBST',
  '43': 'GAS',
  '50': 'SBST',
  '51': 'SBST',
  '52': 'SBST',
  '53': 'SBST',
  '56': 'SBST',
  '57': 'SBST',
  '61': 'SMRT',
  '63': 'SBST',
  '65': 'SBST',
  '66': 'TTS',
  '67': 'SMRT',
  '70': 'SBST',
  '74': 'SBST',
  '77': 'TTS',
  '80': 'SBST',
  '82': 'GAS',
  '83': 'GAS',
  '85': 'GAS',
  '97': 'TTS',
  '100': 'SBST',
  '105': 'SBST',
  '106': 'TTS',
  '107': 'SBST',
  '110': 'SMRT',
  '111': 'SBST',
  '117': 'SBST',
  '124': 'SBST',
  '130': 'SBST',
  '131': 'SBST',
  '133': 'SBST',
  '143': 'TTS',
  '145': 'SBST',
  '147': 'SBST',
  '154': 'SBST',
  '156': 'SBST',
  '161': 'SBST',
  '167': 'SMRT',
  '168': 'SBST',
  '169': 'SMRT',
  '174': 'SBST',
  '175': 'SBST',
  '188': 'SMRT',
  '190': 'SMRT',
  '196': 'SBST',
  '197': 'SBST',
  '198': 'SBST',
  '502': 'SBST',
  '852': 'SMRT',
  '857': 'SBST',
  '858': 'TTS',
  '960': 'SMRT',
  '965': 'SBST',
  '969': 'TTS',
  '970': 'SMRT',
  '972': 'SMRT',
};

export const BUS_ROUTE_SUMMARIES: Record<string, BusRouteSummary> = {
  '7': {
    ServiceNo: '7',
    Operator: 'SBST',
    OriginName: 'Bedok Int',
    DestinationName: 'Clementi Int',
    FirstBus: '05:30',
    LastBus: '23:45',
    FrequencyPeak: '5–9 min',
    KeyStops: ['Bedok Int', 'Paya Lebar Stn', 'Bugis Stn', 'Orchard Stn', 'Holland Village', 'Clementi Int'],
  },
  '14': {
    ServiceNo: '14',
    Operator: 'SBST',
    OriginName: 'Bedok Int',
    DestinationName: 'Clementi Int',
    FirstBus: '05:30',
    LastBus: '23:30',
    FrequencyPeak: '6–10 min',
    KeyStops: ['Bedok Int', 'Marine Parade', 'Suntec City', 'Orchard Stn', 'Dover Stn', 'Clementi Int'],
  },
  '16': {
    ServiceNo: '16',
    Operator: 'SBST',
    OriginName: 'Bedok Int',
    DestinationName: 'Bukit Merah Int',
    FirstBus: '05:35',
    LastBus: '23:40',
    FrequencyPeak: '7–11 min',
    KeyStops: ['Bedok Int', 'Katong', 'Dhoby Ghaut Stn', 'Orchard Stn', 'Tiong Bahru', 'Bukit Merah Int'],
  },
  '36': {
    ServiceNo: '36',
    Operator: 'GAS',
    OriginName: 'Changi Airport PTB1/2/3',
    DestinationName: 'Tomlinson Rd (Loop)',
    FirstBus: '06:00',
    LastBus: '23:52',
    FrequencyPeak: '8–12 min',
    KeyStops: ['Changi Airport', 'ECP Parkway', 'Suntec City', 'Dhoby Ghaut Stn', 'Orchard Stn'],
  },
  '65': {
    ServiceNo: '65',
    Operator: 'SBST',
    OriginName: 'Tampines Int',
    DestinationName: 'HarbourFront Int',
    FirstBus: '05:30',
    LastBus: '23:35',
    FrequencyPeak: '5–8 min',
    KeyStops: ['Tampines Int', 'Kaki Bukit', 'Little India Stn', 'Orchard Stn', 'Outram Park', 'VivoCity'],
  },
  '97': {
    ServiceNo: '97',
    Operator: 'TTS',
    OriginName: 'Jurong East Int',
    DestinationName: 'Marina Centre Ter',
    FirstBus: '05:45',
    LastBus: '23:30',
    FrequencyPeak: '6–10 min',
    KeyStops: ['Jurong East Int', 'Clementi', 'VivoCity', 'Bayfront Ave / MBS', 'Marina Centre'],
  },
  '106': {
    ServiceNo: '106',
    Operator: 'TTS',
    OriginName: 'Bukit Batok Int',
    DestinationName: 'Shenton Way Ter',
    FirstBus: '05:30',
    LastBus: '23:30',
    FrequencyPeak: '5–9 min',
    KeyStops: ['Bukit Batok Int', 'Buona Vista Stn', 'Orchard Stn', 'City Hall', 'Marina Bay Sands', 'Shenton Way'],
  },
  '143': {
    ServiceNo: '143',
    Operator: 'TTS',
    OriginName: 'Toa Payoh Int',
    DestinationName: 'Jurong East Int',
    FirstBus: '05:30',
    LastBus: '23:40',
    FrequencyPeak: '7–12 min',
    KeyStops: ['Toa Payoh Int', 'Orchard Stn', 'Chinatown', 'VivoCity', 'Pasir Panjang', 'Jurong East Int'],
  },
  '167': {
    ServiceNo: '167',
    Operator: 'SMRT',
    OriginName: 'Sembawang Int',
    DestinationName: 'Bukit Merah Int',
    FirstBus: '05:30',
    LastBus: '23:30',
    FrequencyPeak: '10–14 min',
    KeyStops: ['Sembawang Int', 'Yishun', 'Novena', 'Orchard Stn', 'One Raffles Quay', 'Bukit Merah Int'],
  },
  '175': {
    ServiceNo: '175',
    Operator: 'SBST',
    OriginName: 'Clementi Int',
    DestinationName: 'Geylang Lor 1 Ter',
    FirstBus: '05:45',
    LastBus: '23:30',
    FrequencyPeak: '8–12 min',
    KeyStops: ['Clementi Int', 'Queenstown', 'Outram Park', 'Orchard Stn', 'Bugis Stn', 'Geylang Lor 1'],
  },
  '190': {
    ServiceNo: '190',
    Operator: 'SMRT',
    OriginName: 'Choa Chu Kang Int',
    DestinationName: 'New Bridge Rd Ter',
    FirstBus: '05:30',
    LastBus: '23:45',
    FrequencyPeak: '4–7 min',
    KeyStops: ['Choa Chu Kang Int', 'Bukit Panjang', 'Stevens Stn', 'Orchard Stn', 'Clarke Quay', 'Chinatown'],
  },
  '972': {
    ServiceNo: '972',
    Operator: 'SMRT',
    OriginName: 'Bukit Panjang Int',
    DestinationName: 'Bencoolen St (Loop)',
    FirstBus: '05:30',
    LastBus: '23:45',
    FrequencyPeak: '5–8 min',
    KeyStops: ['Bukit Panjang Int', 'Hillview', 'Stevens Stn', 'Orchard Stn', 'Dhoby Ghaut Stn'],
  },
};

function seededHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function getOperator(serviceNo: string): BusOperator {
  if (SERVICE_OPERATORS[serviceNo]) {
    return SERVICE_OPERATORS[serviceNo];
  }
  const n = parseInt(serviceNo, 10) || 100;
  if (n >= 800 && n <= 999) return 'SMRT';
  if (n % 5 === 0) return 'TTS';
  if (n % 7 === 0) return 'GAS';
  return 'SBST';
}

function buildSlot(
  seed: number,
  minutesFromNow: number,
  originCode: string,
  destCode: string,
  slotIndex: number
): NextBusSlot {
  const loads: BusLoad[] = ['SEA', 'SEA', 'SDA', 'SDA', 'LSD'];
  const types: BusType[] = ['DD', 'DD', 'SD', 'DD', 'BD'];

  const load = loads[(seed + slotIndex * 3) % loads.length];
  const type = types[(seed + slotIndex * 2) % types.length];
  const eta = new Date(Date.now() + minutesFromNow * 60_000).toISOString();

  return {
    OriginCode: originCode,
    DestinationCode: destCode,
    EstimatedArrival: eta,
    Latitude: '1.3041',
    Longitude: '103.8318',
    VisitNumber: '1',
    Load: load,
    Feature: (seed + slotIndex) % 9 === 0 ? '' : 'WAB',
    Type: type,
  };
}

export function generateSimulatedArrivals(busStopCode: string): BusArrivalResponse {
  const stop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === busStopCode);
  const serviceNumbers = stop
    ? stop.Services
    : ['14', '65', '106', '143', '190']; // Fallback preview for custom 5-digit codes

  // Rotate phase slowly every 20 seconds so live simulation advances realistically
  const timeBucket = Math.floor(Date.now() / 20_000);

  const services: BusServiceArrival[] = serviceNumbers.map((serviceNo) => {
    const baseSeed = seededHash(`${busStopCode}-${serviceNo}`);
    const headway1 = 4 + (baseSeed % 6); // 4-9 min headway
    const headway2 = 5 + ((baseSeed >> 2) % 7);

    // Compute realistic first arrival between 0 (Arr) and 11 minutes
    const cycleOffset = (baseSeed + timeBucket) % (headway1 + 5);
    const min1 = Math.max(0, cycleOffset > 11 ? 0 : cycleOffset);
    const min2 = min1 + headway1;
    const min3 = min2 + headway2;

    const operator = getOperator(serviceNo);

    return {
      ServiceNo: serviceNo,
      Operator: operator,
      NextBus: buildSlot(baseSeed, min1, busStopCode, '75009', 0),
      NextBus2: buildSlot(baseSeed, min2, busStopCode, '75009', 1),
      NextBus3: buildSlot(baseSeed, min3, busStopCode, '75009', 2),
    };
  });

  // Sort numerically (e.g., 7, 14, 16, 106, 972)
  services.sort((a, b) => {
    const numA = parseInt(a.ServiceNo, 10) || 9999;
    const numB = parseInt(b.ServiceNo, 10) || 9999;
    if (numA !== numB) return numA - numB;
    return a.ServiceNo.localeCompare(b.ServiceNo);
  });

  return {
    BusStopCode: busStopCode,
    Services: services,
    fetchedAt: Date.now(),
  };
}

export function getEstimatedRouteSummary(serviceNo: string): BusRouteSummary {
  if (BUS_ROUTE_SUMMARIES[serviceNo]) {
    return BUS_ROUTE_SUMMARIES[serviceNo];
  }
  const op = getOperator(serviceNo);
  return {
    ServiceNo: serviceNo,
    Operator: op,
    OriginName: 'Regional Interchange',
    DestinationName: 'City / Terminal Loop',
    FirstBus: '05:30',
    LastBus: '23:40',
    FrequencyPeak: '6–12 min',
    KeyStops: ['Interchange Terminal', 'Town Centre', 'MRT Hub', 'City / Loop Terminal'],
  };
}
