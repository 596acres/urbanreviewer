import os


boroughs = {
    '1': 'Manhattan',
    '2': 'Bronx',
    '3': 'Brooklyn',
    '4': 'Queens',
    '5': 'Staten Island',
}


def get_plan_dir(dst, borough, name, create=True):
    plan_dir = os.path.join(dst, borough, name)
    if os.path.exists(plan_dir):
        return plan_dir
    if create:
        try:
            os.mkdir(plan_dir)
            return plan_dir
        except OSError:
            return plan_dir
        except AttributeError:
            return None
    return None


def get_borough_name(key):
    try:
        return boroughs[key]
    except KeyError:
        return None


def get_borough_dir(dst, name):
    try:
        borough_dir = os.path.join(dst, name)
        os.mkdir(borough_dir)
        return borough_dir
    except OSError:
        return borough_dir
    except AttributeError:
        return None


def get_lot_features(lots, plan):
    return filter(lambda l: l['properties']['plan_name'] == plan, lots)
