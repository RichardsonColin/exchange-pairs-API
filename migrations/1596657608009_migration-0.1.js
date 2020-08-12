/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropTable('exchanges', { ifExists: true, cascade: true })
  pgm.dropTable('cryptocurrencies', { ifExists: true, cascade: true })
  pgm.dropTable('base_pairs', { ifExists: true, cascade: true })
  pgm.dropTable('exchange_cryptocurrency_base_pair_references', { ifExists: true, cascade: true })
  pgm.createTable('exchanges', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    description: { type: 'varchar(10000)' },
    "website_url": { type: 'varchar(1000)' },
    "logo_url": { type: 'varchar(1000)' },
    "country_origin": { type: 'varchar(100)' },
    grade: { type: 'varchar(10)' },
    "volume_24_hour": { type: 'decimal' },
    "created_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    "updated_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('cryptocurrencies', {
    id: 'id',
    symbol: { type: 'varchar(100)', notNull: true },
    name: { type: 'varchar(100)' },
    "created_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    "updated_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('base_pairs', {
    id: 'id',
    symbol: { type: 'varchar(100)', notNull: true },
    "created_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    "updated_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('exchange_cryptocurrency_base_pair_references', {
    "exchange_id": {
      type: 'integer',
      notNull: true,
      references: '"exchanges"',
      onDelete: 'cascade',
    },
    "cryptocurrency_id": {
      type: 'integer',
      notNull: true,
      references: '"cryptocurrencies"',
    },
    "base_pair_id": {
      type: 'integer',
      notNull: true,
      references: '"base_pairs"',
    },
    "created_at": {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createIndex('exchange_cryptocurrency_base_pair_references', 'exchange_id')
  pgm.createIndex('exchange_cryptocurrency_base_pair_references', 'cryptocurrency_id')
  pgm.createIndex('exchange_cryptocurrency_base_pair_references', 'base_pair_id')
  pgm.addConstraint('exchanges', 'exchanges_name_AK01', { unique: 'name' })
  pgm.addConstraint('cryptocurrencies', 'cryptocurrencies_symbol_AK01', { unique: 'symbol' })
  pgm.addConstraint('base_pairs', 'base_pairs_symbol_AK01', { unique: 'symbol' })
}

exports.down = pgm => {}
