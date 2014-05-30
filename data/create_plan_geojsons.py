import click
import csv
import geojson
import os

from plans_common import get_borough_dir, get_borough_name, get_lot_features


@click.command()
@click.option('--plans', help='A CSV of plans')
@click.option('--lots', help='A GeoJSON containing lot data')
@click.option('--dst', help='The destination directory')
def create_plan_geojsons(plans, lots, dst):
    lots = geojson.load(open(lots, 'r'))['features']
    for row in csv.DictReader(open(plans, 'r')):
        plan_name = unicode(row['Name of Plan'], encoding='utf8')

        borough_dir = get_borough_dir(dst, get_borough_name(row['Borough']))
        if not borough_dir:
            print 'Failed to create directory for %s. Skipping.' % plan_name
            continue

        print 'Creating GeoJSON for %s' % plan_name
        lot_features = get_lot_features(lots, plan_name)

        plan_file_name = '%s.geojson' % plan_name.replace(os.sep, '-')
        plan_file = open(os.path.join(borough_dir, plan_file_name), 'w+')
        geojson.dump(geojson.FeatureCollection(lot_features), plan_file)


if __name__ == '__main__':
    create_plan_geojsons()
