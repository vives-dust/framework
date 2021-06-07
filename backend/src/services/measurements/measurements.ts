
enum Period {
    'Last', '1h', '24h', '7d', '31d', '1y', 'all'
}

enum Properties {
    'battery', 'temperature', 'pressure', 'humidity', 'rssi'
}

interface QueryAttributes {
  properties: string;
  measurement: string;
  deviceId: string;
  period: string;
  group: string;
  orderBy: boolean;
  fill: boolean;
}

const periodMap = {
  [Period["Last"]]: '5m',
  [Period["1h"]]: '1m',
  [Period["24h"]]: '5m',
  [Period["7d"]]: '30m',
  [Period["31d"]]: '2h',
  [Period["1y"]]: '24h',
  [Period["all"]]: '24h',
}



export const queryBuilder = (properties: Properties[], sensorId: string, period: Period) => {
  const queryAttributes: QueryAttributes = {
    properties: properties.map( prop => `mean(${prop}) as ${prop}`).join(', '),
    measurement: 'tph',
    deviceId: sensorId,
    period: period.toString(),
    groupBy: periodMap[period]

  }

  const meanProperties = properties.map( prop => `mean(${prop}) as ${prop}`);

}

get queryAttributes() {

}