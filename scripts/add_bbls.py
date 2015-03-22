import csv
import sys


def csvvalue(v):
    if ',' in v:
        return '"%s"' % v
    return v


def add_bbls(fp):
    """
    Add BBLs (Borough, Block, and Lot numbers) to a csv of lots with the
    constituent fields.
    """
    reader = csv.DictReader(fp)
    print 'BBL,' + ','.join(reader.fieldnames)
    for row in reader:
        try:
            bbl = '%d%05d%04d' % tuple(int(row[c]) for c in ('Borough', 'Block', 'Lot'))
            print ','.join([bbl,] + [csvvalue(row[f]) for f in reader.fieldnames])
        except Exception:
            continue


if __name__ == '__main__':
    add_bbls(sys.stdin)
