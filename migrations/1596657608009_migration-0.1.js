/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropTable('exchanges', { ifExists: true, cascade: true })
  pgm.dropTable('assets', { ifExists: true, cascade: true })
  pgm.dropTable('exchange_asset_pair_references', { ifExists: true, cascade: true })
  pgm.createTable('exchanges', {
    id: 'id',
    api_id: { type: 'varchar(100)', notNull: true },
    name: { type: 'varchar(100)', notNull: true },
    url: { type: 'varchar(1000)' },
    image: { type: 'varchar(1000)' },
    origin: { type: 'varchar(100)' },
    grade: { type: 'varchar(100)' },
    volume_24_hour: { type: 'float' },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('assets', {
    id: 'id',
    api_id: { type: 'varchar(100)', notNull: true },
    symbol: { type: 'varchar(100)', notNull: true },
    name: { type: 'varchar(100)' },
    image: { type: 'varchar(1000)' },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('exchange_asset_pair_references', {
    id: 'id',
    exchange_id: {
      type: 'integer',
      notNull: true,
      references: '"exchanges"',
      onDelete: 'cascade',
    },
    asset_symbol: {
      type: 'varchar(100)',
      notNull: true,
    },
    quote_symbol: {
      type: 'varchar(100)',
      notNull: true,
    },
    is_stale: {
      type: 'boolean',
      default: false
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createIndex('exchange_asset_pair_references', 'exchange_id')
  pgm.addConstraint('exchanges', 'exchanges_api_id_PK01', { unique: 'api_id' })
  pgm.addConstraint('exchanges', 'exchanges_name_PK02', { unique: 'name' })
  pgm.addConstraint('assets', 'assets_api_id_PK01', { unique: 'api_id' })
  pgm.addConstraint('assets', 'assets_symbol_PK02', { unique: 'symbol' })
  pgm.addConstraint('exchange_asset_pair_references', 'exchange_asset_pair_references_ids_PK01', { unique: ['exchange_id', 'asset_symbol', 'quote_symbol'] })
}

exports.down = pgm => {}
