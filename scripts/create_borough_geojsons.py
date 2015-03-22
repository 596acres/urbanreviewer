import click
import csv
import geojson
from itertools import groupby
import os

from plans_common import get_borough_dir, get_borough_name, get_lot_features


@click.command()
@click.option('--plans', help='A CSV of plans')
@click.option('--lots', help='A GeoJSON containing lot data')
@click.option('--dst', help='The destination directory')
def create_borough_geojsons(plans, lots, dst):
    lots = geojson.load(open(lots, 'r'))['features']

    borough_grouped = groupby(csv.DictReader(open(plans, 'r')), lambda p: p['Borough'])
    for borough, plans in borough_grouped:
        borough_name = get_borough_name(borough)
        borough_dir = get_borough_dir(dst, borough_name)
        if not borough_dir:
            print 'Failed to create directory for %s. Skipping.' % borough
            continue
        plan_names = [unicode(p['Name of Plan'], encoding='utf8') for p in plans]
        features = [get_lot_features(lots, p) for p in plan_names]
        features = reduce(lambda x, y: x + y, features)

        print 'Creating GeoJSON for %s' % borough_name
        borough_file = open(os.path.join(borough_dir, 'all.geojson'), 'w+')
        geojson.dump(geojson.FeatureCollection(features), borough_file)


if __name__ == '__main__':
    create_borough_geojsons()
