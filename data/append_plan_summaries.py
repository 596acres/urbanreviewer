import click
import csv
import os

from plans_common import get_borough_dir, get_plan_dir


def append_to_plan_index(dst, borough, name, text):
    plan_index_path = os.path.join(dst, borough, name.replace('/', '-'), 'index.md')
    with open(plan_index_path, 'a') as plan_file:
        plan_file.write(text)


@click.command()
@click.option('--dst', help='The destination directory')
@click.option('--summaries', help='A CSV of plan summaries')
def append_plan_summaries(dst, summaries):
    """Add plan summaries to index markdown files for each plan."""
    for row in csv.DictReader(open(summaries, 'r')):
        plan_name = unicode(row['Copyedited name of plan'], encoding='utf8')
        borough = row['boro']

        borough_dir = get_borough_dir(dst, borough)
        if not borough_dir:
            print 'Failed to create directory for %s. Skipping.' % borough
            continue

        plan_dir = get_plan_dir(dst, borough, plan_name.replace('/', '-'),
                                create=False)
        if not plan_dir:
            print 'Failed to find directory for %s. Skipping.' % plan_name
            continue

        append_to_plan_index(dst, borough, plan_name, '\n%s' % row['Plan Summary'])


if __name__ == '__main__':
    append_plan_summaries()
