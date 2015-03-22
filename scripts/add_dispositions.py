"""
Add filterable and edited dispositions to each lot in a borough table using the
lots' raw dispositions.
"""
import click
import sqlite3


@click.command()
@click.option('--borough')
@click.option('--db')
def add_dispositions(borough, db):
    conn = sqlite3.connect(db)
    c = conn.cursor()

    # Add disposition columns to borough table
    try:
        c.execute(("ALTER TABLE '%s' ADD COLUMN 'filterable_disposition' "
                   "VARCHAR(300)") % borough)
    except sqlite3.OperationalError:
        print 'filterable_disposition already exists. Moving on.'

    try:
        c.execute(("ALTER TABLE '%s' ADD COLUMN 'edited_disposition' "
                   "VARCHAR(700)") % borough)
    except sqlite3.OperationalError:
        print 'edited_disposition already exists. Moving on.'

    # Find relevant filtered disposition, update
    update_sql = (("UPDATE '%s' "
        "SET filterable_disposition = ("
        "SELECT d.'Filterable disposition' "
        "FROM 'Lot dispositions' d "
        "WHERE d.'Raw disposition' = Disposition)") % borough)
    c.execute(update_sql)

    # Find relevant edited disposition, update
    update_sql = (("UPDATE '%s' "
        "SET edited_disposition = ("
        "SELECT d.'Edited disposition' "
        "FROM 'Lot dispositions' d "
        "WHERE d.'Raw disposition' = Disposition)") % borough)
    c.execute(update_sql)

    conn.commit()
    conn.close()


if __name__ == '__main__':
    add_dispositions()
