/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('exchange_asset_pair_references', {
    asset_id: {
      type: 'integer',
      references: '"assets"',
      onDelete: 'cascade',
    },
    quote_id: {
      type: 'integer',
      references: '"assets"',
      onDelete: 'cascade',
     },
  })
  pgm.createIndex('exchange_asset_pair_references', 'asset_id')
  pgm.createIndex('exchange_asset_pair_references', 'quote_id')
};

exports.down = pgm => {
  pgm.dropColumns('exchange_asset_pair_references', {
    asset_id: {
      ifExists: true
    },
    quote_id: {
      ifExists: true
     }
  })
  pgm.dropIndex('exchange_asset_pair_references', 'asset_id', { ifExists: true })
  pgm.dropIndex('exchange_asset_pair_references', 'quote_id', { ifExists: true })
};
