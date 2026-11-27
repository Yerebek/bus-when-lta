export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export type BusLoad = 'SEA' | 'SDA' | 'LSD';

export type BusType = 'SD' | 'DD' | 'BD';

export type BusFeature = 'WAB' | '';

export interface NextBusSlot {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string; // ISO 8601 timestamp matching LTA DataMall v2
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: BusLoad;
  Feature: BusFeature;
  Type: BusType;
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus: NextBusSlot;
  NextBus2: NextBusSlot;
  NextBus3: NextBusSlot;
}

export interface BusArrivalResponse {
  BusStopCode: string;
  Services: BusServiceArrival[];
  fetchedAt: number;
  source?: 'live' | 'simulated';
}

export interface ApiHealthStatus {
  status: 'ok';
  service: string;
  ltaConfigured: boolean;
  endpointVersion: string;
  timestamp: string;
}

export type SingaporeRegion = 'Central' | 'East' | 'West' | 'North' | 'North-East';

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  Region: SingaporeRegion;
  NearbyMRT?: string;
  Services: string[];
}

export interface FavoriteStop {
  BusStopCode: string;
  nickname?: string;
  pinnedServices: string[];
  addedAt: number;
}

export interface BusRouteSummary {
  ServiceNo: string;
  Operator: BusOperator;
  OriginName: string;
  DestinationName: string;
  FirstBus: string;
  LastBus: string;
  FrequencyPeak: string;
  KeyStops: string[];
}
