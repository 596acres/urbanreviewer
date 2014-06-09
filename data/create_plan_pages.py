import click
import csv
import os

from plans_common import get_borough_dir, get_borough_name


def get_plan_dir(dst, borough, name):
    try:
        plan_dir = os.path.join(dst, borough, name)
        os.mkdir(plan_dir)
        return plan_dir
    except OSError:
        return plan_dir
    except AttributeError:
        return None


def index_text(plan_name):
    """Get text for index file for a given plan"""
    return """---
layout: plan
title: "%s"
permalink: index.html
---
""" % plan_name


def create_plan_index(dst, borough, name):
    plan_index_path = os.path.join(dst, borough, name.replace('/', '-'), 'index.md')
    if not os.path.exists(plan_index_path):
        plan_file = open(plan_index_path, 'w')
        plan_file.write(index_text(name).encode('utf-8'))


@click.command()
@click.option('--plans', help='A CSV of plans')
@click.option('--dst', help='The destination directory')
def create_plan_pages(plans, dst):
    """
    Create plan directories and stub index markdown files for each plan.
    """
    for row in csv.DictReader(open(plans, 'r')):
        plan_name = unicode(row['Name of Plan'], encoding='utf8')
        borough = get_borough_name(row['Borough'])

        borough_dir = get_borough_dir(dst, borough)
        if not borough_dir:
            print 'Failed to create directory for %s. Skipping.' % borough
            continue

        plan_dir = get_plan_dir(dst, borough, plan_name.replace('/', '-'))
        if not plan_dir:
            print 'Failed to create directory for %s. Skipping.' % plan_name
            continue

        print 'Creating plan index for %s' % plan_name
        create_plan_index(dst, borough, plan_name)


if __name__ == '__main__':
    create_plan_pages()
