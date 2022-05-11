import {
  ParameterizedQuery,
  flux,
  fluxExpression,
  fluxString,
} from '@influxdata/influxdb-client';

export enum Period {
  '1h', '24h', '7d', '31d', '1y', 'all', 'last'
}

const periods = {
  '1h': { start: '-1h', every: '1m' },
  '24h': { start: '-24h', every: '5m' },
  '7d': { start: '-7d', every: '30m' },
  '31d': { start: '-31d', every: '2h' },
  '1y': { start: '-1y', every: '24h' },
  'all': { start: '0', every: '24h' },
  'last': { start: '0', every: undefined }
};

const QueryHelper = {

  tag_filter(tags: { [key: string]: string } ) : ParameterizedQuery {
    return flux`|> filter(fn: (r) => ${fluxExpression(
      Object.keys(tags).map((key) => `r["${key}"] == "${tags[key]}"`).join(' and ')
    )})`;    // Don't sanitize ! (would escape double quotes)
  },

  field_filter(fields: string[]) : ParameterizedQuery {
    return flux`|> filter(fn: (r) => ${fluxExpression(
      fields.map(f => `r["_field"] == "${f}"`).join(' or ')
    )})`;    // Don't sanitize ! (would escape double quotes)
  },

  keep_columns(fields: string[], tags?: { [key: string]: string } ) : ParameterizedQuery {
    const columnsToKeep = fields.concat('_time').concat(Object.keys(tags || {}));
    return flux`|> keep(columns: ${columnsToKeep})`;
  },

  range_expression(start: string, stop?: string) : ParameterizedQuery {
    const startExpr = fluxExpression(start);
    const stopExpr = fluxExpression(stop || 'now()');
    return flux`|> range(start: ${startExpr}, stop: ${stopExpr} )`
  },

  aggregate_expression(every: string) : ParameterizedQuery {
    return flux`|> aggregateWindow(every: ${fluxExpression(every)}, fn: mean, createEmpty: false )`
  },

  last_expression() : ParameterizedQuery {
    return flux`|> last()`;
  },

  rename_columns(mappings: { [key: string]: string }) : ParameterizedQuery {
    return flux`|> rename(columns: ${fluxExpression(JSON.stringify(mappings))})`;
  }

};

export interface InfluxDBQueryParams {
  bucket: string,
  measurement: string,
  tags?: { [key: string]: string },
  fields?: string[],      // If fields is set, only those are returned + _time + tags - Want more tags to be included ? Add it as field
  period?: Period,        // Takes precedence over start/stop - last is default if start/stop is not specified either
  start?: string,
  stop?: string,
  every?: string,         // Takes precedence over period.every
  aliases?: { [key: string]: string }
}

export const QueryBuilder = {

  build_query: (params: InfluxDBQueryParams) => {
    const timing = (periods as any)[Period[params.period || Period.last]];
    let start = (params.period || !params.start) ? timing.start : params.start;

    let every = params.every ? params.every : timing.every;

    return flux`from(bucket:"${params.bucket}") 
      ${QueryHelper.range_expression(start, params.stop)}
      |> filter(fn: (r) => r._measurement == ${params.measurement})
      ${params.tags ? QueryHelper.tag_filter(params.tags) : fluxExpression('')}
      ${params.fields ? QueryHelper.field_filter(params.fields) : fluxExpression('')}
      ${every ? QueryHelper.aggregate_expression(every) : QueryHelper.last_expression()}
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      ${params.fields ? QueryHelper.keep_columns(params.fields, params.tags) : fluxExpression('')}
      ${params.aliases ? QueryHelper.rename_columns(params.aliases) : fluxExpression('')}
    `;
  },

};