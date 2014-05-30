import click
import csv
import geojson
import os


boroughs = {
    '1': 'Manhattan',
    '2': 'Bronx',
    '3': 'Brooklyn',
    '4': 'Queens',
    '5': 'Staten Island',
}


def get_borough_name(key):
    try:
        return boroughs[key]
    except KeyError:
        return None

@click.command()
@click.option('--plans', help='A CSV of plans')
@click.option('--lots', help='A GeoJSON containing lot data')
@click.option('--dst', help='The destination directory')
def create_plan_geojsons(plans, lots, dst):
    lots = geojson.load(open(lots, 'r'))['features']
    for row in csv.DictReader(open(plans, 'r')):
        plan_name = unicode(row['Name of Plan'], encoding='utf8')

        try:
            borough_dir = os.path.join(dst, get_borough_name(row['Borough']))
            os.mkdir(borough_dir)
        except OSError:
            pass
        except AttributeError:
            print 'Problem creating borough dir for %s. Skipping.' % plan_name
            continue

        print 'Creating GeoJSON for %s' % plan_name
        lot_features = get_lot_features(lots, plan_name)

        plan_file_name = '%s.geojson' % plan_name.replace(os.sep, '-')
        plan_file = open(os.path.join(borough_dir, plan_file_name), 'w+')
        geojson.dump(geojson.FeatureCollection(lot_features), plan_file)


def get_lot_features(lots, plan):
    return filter(lambda l: l['properties']['plan_name'] == plan, lots)


if __name__ == '__main__':
    create_plan_geojsons()
