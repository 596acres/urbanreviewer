from cartodb import CartoDBAPIKey, CartoDBException
import click
import csv
import geojson
from geomet import wkt
import os


# TODO this API key no longer works. Hacky but we can print out the SQL
# for one plan and insert that as needed.

API_KEY = os.environ['URBAN_REVIEWER_CARTODB_KEY']
CARTODB_DOMAIN = 'urbanreviewer'

PLANS_TABLE = 'plans'
LOTS_TABLE = 'lots'


@click.command()
@click.option('--plans', help='A CSV containing plan data')
@click.option('--lots', help='A GeoJSON containing lot data')
@click.option('--planname', help='The plan to add')
@click.option('--planid', help='The plan id in Carto')
def add_to_cartodb(plans, lots, planname, planid):
    cursor = cartodb_cursor()
    # print 'planname', planname
    # insert_plans(cursor, plans, planname)
    # plans = select_plans(cursor, planname)
    # print plans
    insert_lots(cursor, lots, planid, planname)


def cartodb_cursor():
    return CartoDBAPIKey(API_KEY, CARTODB_DOMAIN)


def format_plan_date(year):
    try:
        return "'%d-01-01'" % int(year)
    except (TypeError, ValueError):
        return 'NULL'


def insert_plans(cursor, filename, planname):
    """Insert plans into CartoDB."""
    table_headers = ('borough', 'name', 'adopted', 'expires', 'updated',
                     'status',)
    values = []

    boroughs = {
        '1': 'Manhattan',
        '2': 'Bronx',
        '3': 'Brooklyn',
        '4': 'Queens',
        '5': 'Staten Island',
    }

    def get_borough_name(key):
        try:
            return "'%s'" % boroughs[key]
        except KeyError:
            return 'NULL'

    for row in csv.DictReader(open(filename, 'r')):
        if row['Name of Plan'] != planname:
            continue

        values.append('(%s)' % ','.join((
            get_borough_name(row['Borough']),
            "'%s'" % row['Name of Plan'],
            format_plan_date(row['Date Adopted']),
            format_plan_date(row['Expiration']),
            format_plan_date(row['Last Updated']),
            "'%s'" % row['Status'].lower(),
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


def select_plans(cursor, planname):
    sql = "SELECT cartodb_id, name FROM %s WHERE name='%s'" % (
        PLANS_TABLE,
        planname
    )
    try:
        rows = cursor.sql(sql)['rows']
        return dict([(r['name'], r['cartodb_id']) for r in rows])
    except CartoDBException as e:
        print ('Failed to select plans', e)


def insert_lots(cursor, filename, planid, planname):
    """Insert lots into CartoDB."""
    lots = geojson.load(open(filename, 'r'))['features']
    values = []

    def get_bbl(bbl):
        try:
            return "\'%s\'" % bbl
        except Exception:
            return 'NULL'

    def get_disposition(disposition):
        try:
            # Escape quotes
            return "\'%s\'" % disposition.replace("'", "''")
        except AttributeError:
            return 'NULL'

    def get_in_596(in_596):
        if in_596 == 1:
            return 'true'
        return 'false'

    def get_in_parking(in_parking):
        if in_parking == 1:
            return 'true'
        return 'false'

    for lot in lots:
        properties = lot['properties']
        if properties['plan_name'] != planname:
            continue
        try:
            block = '%d' % properties['block']
        except TypeError:
            block = 'NULL'
        try:
            lot_number = '%d' % properties['lot']
        except TypeError:
            lot_number = 'NULL'

        values.append('(%s)' % ','.join((
            "'SRID=4326;%s'" % wkt.dumps(lot['geometry']),
            get_bbl(properties['BBL']),
            block,
            lot_number,
            planid,
            get_disposition(properties['disposition_filterable']),
            get_disposition(properties['disposition_display']),
            get_in_596(properties['in_596']),
            get_in_parking(properties['in_parking']),
        )))

    sql = 'INSERT INTO %s (%s) VALUES %s' % (
        LOTS_TABLE,
        ','.join(('the_geom', 'BBL', 'block', 'lot', 'plan_id',
                  'disposition_filterable', 'disposition_display', 'in_596',
                  'in_parking',)),
        ','.join(values),
    )
    print sql
    # try:
    #   print 'Inserting lots', cursor.sql(sql)
    #xcept CartoDBException as e:
    #   print ('Failed to insert lots', e)


if __name__ == '__main__':
    add_to_cartodb()
