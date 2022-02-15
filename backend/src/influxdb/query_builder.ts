import {
  ParameterizedQuery,
  flux,
  fluxDuration,
  fluxExpression,
  FluxParameterLike,
} from '@influxdata/influxdb-client';

export enum Period {
  '1h', '24h', '7d', '31d', '1y', 'all'
}

const periods = {
  '1h': { start: '-1h', every: '1m' },
  '24h': { start: '-24h', every: '5m' },
  '7d': { start: '-7d', every: '30m' },
  '31d': { start: '-31d', every: '2h' },
  '1y': { start: '-1y', every: '24h' },
  'all': { start: '0', every: '24h' },
};

const QueryHelper = {

  field_filter_expression(fields: Array<string>) : FluxParameterLike {
    return fluxExpression(
      fields.map(f => `r["_field"] == "${f}"`).join(' or ')
    );    // Don't sanitize ! (would escape double quotes)
  },

};

export const QueryBuilder = {
  measurements_aggregate_window: (bucket: string, measurement: string, deviceId: string, period: Period, fields: Array<string>) : ParameterizedQuery => {

    const fieldFilter = QueryHelper.field_filter_expression(fields);
    const columnsToKeep = fields.concat('_time');
    const timing = (periods as any)[Period[period]];     // Not cool. How to fix?

    const start = timing.start !== '0' ? fluxDuration(timing.start) : fluxExpression(timing.start);
    const every = fluxExpression(timing.every);

    return flux`from(bucket:"${bucket}") 
      |> range(start: ${start})
      |> filter(fn: (r) => r._measurement == ${measurement})
      |> filter(fn: (r) => r["devId"] == ${deviceId})
      |> filter(fn: (r) => ${fieldFilter})
      |> aggregateWindow(every: ${every}, fn: mean, createEmpty: false )
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ${columnsToKeep})
    `;
  },

  last_measurement: (bucket: string, measurement: string, deviceId: string, fields: Array<string>) : ParameterizedQuery => {

    const fieldFilter = QueryHelper.field_filter_expression(fields);
    const columnsToKeep = fields.concat('_time');

    return flux`from(bucket:"${bucket}") 
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == ${measurement})
      |> filter(fn: (r) => r["devId"] == ${deviceId})
      |> filter(fn: (r) => ${fieldFilter})
      |> last()
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ${columnsToKeep})
    `;
  }

};