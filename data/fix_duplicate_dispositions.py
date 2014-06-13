"""
Combine filterable and edited dispositions to each lot in a borough table that
appears multiple times in the same plan.

Also delete lots that appear multiple times in the same plan.

Does not touch lots that appear in multiple plans.
"""
import click
import sqlite3


fields = (
    'BBL',
    'Borough',
    'Block',
    'Lot',
    'Name of Plan',
    'Date Adopted',
    'Status',
    'Date Expired',
    'Last Updated',
    'Disposition',
    'Source',
    'Justification for Inclusion',
    'Second Evaluation Needed',
    'filterable_disposition',
    'edited_disposition'
)


@click.command()
@click.option('--borough')
@click.option('--db')
def fix_duplicate_dispositions(borough, db):
    conn = sqlite3.connect(db)
    c = conn.cursor()

    # Find lots to update
    select_sql = ((
        "SELECT b.'Name of Plan', b.bbl, COUNT(b.bbl) AS c "
        "FROM '%s' b "
        "GROUP BY b.'Name of Plan', b.bbl "
        "HAVING c > 1"
    ) % borough)
    rows = c.execute(select_sql).fetchall()
    for row in rows:
        plan_name, bbl, count = row

        # Get dispositions
        dispositions = c.execute((
            "SELECT DISTINCT(b.filterable_disposition), b.edited_disposition "
            "FROM '%s' b "
            "WHERE b.bbl = ? AND b.'Name of Plan' = ?"
        ) % borough, (bbl, plan_name)).fetchall()

        # Combine and update dispositions
        combined_filterable_disposition = ', '.join([d[0] for d in dispositions if d[0]])
        combined_edited_disposition = '; '.join([d[1] for d in dispositions if d[1]])
        c.execute(
            (
                "UPDATE '%s' "
                "SET filterable_disposition = ?, edited_disposition = ? "
                "WHERE bbl = ? AND '%s'.'Name of Plan' = ?"
            ) % (borough, borough),
            (
                combined_filterable_disposition,
                combined_edited_disposition,
                bbl,
                plan_name,
            )
        )

        #
        # Delete lots that are now duplicates
        #

        # Select all the fields
        sql = (
            "SELECT %s "
            "FROM %s b "
            "WHERE b.bbl = ? AND b.'Name of Plan' = ?"
        ) % (','.join(["b.'%s'" % f for f in fields]), borough)
        r = c.execute(sql, (bbl, plan_name))
        values = r.fetchone()

        #  Delete all matching lots (bbl, plan name)
        c.execute((
            "DELETE FROM '%s' "
            "WHERE bbl = ? AND '%s'.'Name of Plan' = ?") % (borough, borough),
            (bbl, plan_name)
        )

        #  Insert using the fields we selected
        c.execute("INSERT INTO '%s' (%s) VALUES (%s)" % (
            borough,
            ','.join(["'%s'" % f for f in fields]),
            ','.join(["'%s'" % v for v in values]),
        ))

    conn.commit()
    conn.close()


if __name__ == '__main__':
    fix_duplicate_dispositions()
