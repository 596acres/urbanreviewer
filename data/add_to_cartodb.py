from cartodb import CartoDBAPIKey, CartoDBException
import click
import csv
import geojson
from geomet import wkt
import os


API_KEY = os.environ['URBAN_REVIEWER_CARTODB_KEY']
CARTODB_DOMAIN = 'urbanreviewer'

PLANS_TABLE = 'plans'
LOTS_TABLE = 'lots'


@click.command()
@click.option('--plans', help='A CSV containing plan data')
@click.option('--lots', help='A GeoJSON containing lot data')
def add_to_cartodb(plans, lots):
    cursor = cartodb_cursor()
    delete_plans(cursor)
    insert_plans(cursor, plans)
    plans = select_plans(cursor)
    delete_lots(cursor)
    insert_lots(cursor, lots, plans)


def cartodb_cursor():
    return CartoDBAPIKey(API_KEY, CARTODB_DOMAIN)


def delete_plans(cursor):
    """Delete plans from CartoDB."""
    try:
        print 'Deleting plans', cursor.sql('DELETE FROM %s' % PLANS_TABLE)
    except CartoDBException as e:
        print ('Failed to delete plans', e)


def format_plan_date(year):
    if year:
        return "'%s-01-01'" % year
    return 'NULL'


def insert_plans(cursor, filename):
    """Insert plans into CartoDB."""
    table_headers = ('name', 'adopted', 'expires', 'updated',)
    values = []
    for row in csv.DictReader(open(filename, 'r')):
        values.append('(%s)' % ','.join((
            "'%s'" % row['Name of Plan'],
            format_plan_date(row['Date Adopted']),
            format_plan_date(row['Expiration']),
            format_plan_date(row['Last Updated']),
        )))

    sql = 'INSERT INTO %s (%s) VALUES %s' % (
        PLANS_TABLE,
        ','.join(table_headers),
        ','.join(values),
    )
    try:
        print 'Inserting plans', cursor.sql(sql)
    except CartoDBException as e:
        print ('Failed to insert plans', e)


def select_plans(cursor):
    sql = 'SELECT cartodb_id, name FROM %s' % PLANS_TABLE
    try:
        rows = cursor.sql(sql)['rows']
        return dict([(r['name'], r['cartodb_id']) for r in rows])
    except CartoDBException as e:
        print ('Failed to select plans', e)


def delete_lots(cursor):
    """Delete lots from CartoDB."""
    try:
        print 'Deleting lots', cursor.sql('DELETE FROM %s' % LOTS_TABLE)
    except CartoDBException as e:
        print ('Failed to delete lots', e)


def insert_lots(cursor, filename, plans):
    """Insert lots into CartoDB."""
    lots = geojson.load(open(filename, 'r'))['features']
    values = []
    def get_plan_id(name):
        try:
            return '%d' % plans[name]
        except Exception:
            return 'NULL'
    for lot in lots:
        properties = lot['properties']
        values.append('(%s)' % ','.join((
            "'SRID=4326;%s'" % wkt.dumps(lot['geometry']),
            '%d' % properties['Block'],
            "'%s'" % properties['Borough'],
            '%d' % properties['Lot'],
            get_plan_id(properties['URPC-R3-_3']),
        )))

    sql = 'INSERT INTO %s (%s) VALUES %s' % (
        LOTS_TABLE,
        ','.join(('the_geom', 'block', 'borough', 'lot', 'plan_id',)),
        ','.join(values),
    )
    try:
        print 'Inserting lots', cursor.sql(sql)
    except CartoDBException as e:
        print ('Failed to insert lots', e)


if __name__ == '__main__':
    add_to_cartodb()
