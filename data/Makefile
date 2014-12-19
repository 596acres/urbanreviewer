pluto_dir = ${PLUTO_DIR}
sqlite_db = working.db

select_boroughs = CAST(b.BBL as text) AS BBL, b.Borough AS borough, b.Block AS block, b.Lot AS lot, b.'Name of Plan' AS plan_name

select_dispositions = b.filterable_disposition AS disp_filt, b.edited_disposition AS disp_edit

join_596 = LEFT OUTER JOIN '596_lots' fns ON fns.bbl= b.BBL
select_596 = (fns.bbl IS NOT NULL) AS in_596

join_parking = LEFT OUTER JOIN 'parking_lots' parking ON parking.bbl= b.BBL
select_parking = (parking.bbl IS NOT NULL) AS in_parking

csvs:
	# Take latest borough Excel files, turn each into its own, cleaned CSV with
	# a BBL column
	mkdir -p csv
	in2csv excel/Bronx.xlsx | csvcut -c 1-12 | python add_bbls.py > csv/Bronx.csv
	in2csv excel/Brooklyn.xlsx | csvcut -c 1-12 | python add_bbls.py > csv/Brooklyn.csv
	in2csv excel/Manhattan.xlsx | csvcut -c 1-12 | python add_bbls.py > csv/Manhattan.csv
	in2csv excel/Queens.xlsx | csvcut -c 1-12 | python add_bbls.py > csv/Queens.csv
	in2csv "excel/Staten Island.xlsx" | csvcut -c 1-12 | python add_bbls.py > "csv/Staten Island.csv"

load_pluto:
	rm -f $(sqlite_db)
	ogr2ogr -progress -f "SQLite" $(sqlite_db) $(pluto_dir)Bronx/BXMapPLUTO.shp
	ogr2ogr -progress -f "SQLite" -update $(sqlite_db) $(pluto_dir)Brooklyn/BKMapPLUTO.shp
	ogr2ogr -progress -f "SQLite" -update $(sqlite_db) $(pluto_dir)Manhattan/MNMapPLUTO.shp
	ogr2ogr -progress -f "SQLite" -update $(sqlite_db) $(pluto_dir)Queens/QNMapPLUTO.shp
	ogr2ogr -progress -f "SQLite" -update $(sqlite_db) "$(pluto_dir)Staten_Island/SIMapPLUTO.shp"

download_596:
	curl -L "http://596acres.org/lots/csv?boroughs=Bronx%2CBrooklyn%2CManhattan%2CQueens%2CStaten%20Island&lot_types=organizing_sites%2Cpublic_accessed_sites%2Cvacant_sites%2Corganizing_lots%2Cpublic_accessed_lots%2Cvacant_lots%2C&parents_only=false&download=true" -o 596_lots.csv

load_596:
	-sqlite3 $(sqlite_db) "DROP TABLE '596_lots'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "596_lots.csv"

load_parking_lots:
	# Extracted from PLUTO by Charles, parcels in plans that were not designated
	# parking lots but are now being used as parking lots.
	-sqlite3 $(sqlite_db) "DROP TABLE 'parking_lots'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "parking_lots.csv"

load_lots: csvs
	-sqlite3 $(sqlite_db) "DROP TABLE 'Lot dispositions'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "Lot dispositions.csv"

	-sqlite3 $(sqlite_db) 'DROP TABLE Bronx'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Bronx.csv
	python add_dispositions.py --borough Bronx --db $(sqlite_db)
	python fix_duplicate_dispositions.py --borough Bronx --db $(sqlite_db)

	-sqlite3 $(sqlite_db) 'DROP TABLE Brooklyn'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Brooklyn.csv
	python add_dispositions.py --borough Brooklyn --db $(sqlite_db)
	python fix_duplicate_dispositions.py --borough Brooklyn --db $(sqlite_db)

	-sqlite3 $(sqlite_db) 'DROP TABLE Manhattan'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Manhattan.csv
	python add_dispositions.py --borough Manhattan --db $(sqlite_db)
	python fix_duplicate_dispositions.py --borough Manhattan --db $(sqlite_db)

	-sqlite3 $(sqlite_db) 'DROP TABLE Queens'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Queens.csv
	python add_dispositions.py --borough Queens --db $(sqlite_db)
	python fix_duplicate_dispositions.py --borough Queens --db $(sqlite_db)

	-sqlite3 $(sqlite_db) "DROP TABLE 'Staten Island'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "csv/Staten Island.csv"
	python add_dispositions.py --borough "Staten Island" --db $(sqlite_db)
	python fix_duplicate_dispositions.py --borough "Staten Island" --db $(sqlite_db)

shps: load_lots load_596 load_parking_lots
	mkdir -p shp

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596), $(select_parking) FROM BXMapPLUTO p INNER JOIN Bronx b ON b.BBL=p.BBL $(join_596) $(join_parking)" shp/Bronx.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596), $(select_parking) FROM BKMapPLUTO p INNER JOIN Brooklyn b ON b.BBL=p.BBL $(join_596) $(join_parking)" shp/Brooklyn.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596), $(select_parking) FROM MNMapPLUTO p INNER JOIN Manhattan b ON b.BBL=p.BBL $(join_596) $(join_parking)" shp/Manhattan.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596), $(select_parking) FROM QNMapPLUTO p INNER JOIN Queens b ON b.BBL=p.BBL $(join_596) $(join_parking)" shp/Queens.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596), $(select_parking) FROM SIMapPLUTO p INNER JOIN 'Staten Island' b ON b.BBL=p.BBL $(join_596) $(join_parking)" "shp/Staten Island.shp" $(sqlite_db)

merge: shps
	rm -f shp/merge.*
	ogr2ogr -update -append shp/merge.shp "shp/Bronx.shp" -nln merge -lco ENCODING=UTF-8
	ogr2ogr -update -append shp/merge.shp "shp/Brooklyn.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/Manhattan.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/Queens.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/Staten Island.shp" -nln merge

simplify: merge
	ogr2ogr -simplify 0.2 -t_srs EPSG:4326 -overwrite shp/simplified.shp shp/merge.shp -lco ENCODING=UTF-8

geojson: simplify
	rm -f lots.geojson
	ogr2ogr -f "GeoJSON" -sql "SELECT BBL, block, lot, plan_name, disp_filt AS disposition_filterable, disp_edit AS disposition_display, in_596, in_parking FROM simplified" lots.geojson shp/simplified.shp

merge_csvs: csvs
	cat csv/Manhattan.csv > merge.csv
	tail -n +2 csv/Bronx.csv >> merge.csv
	tail -n +2 csv/Brooklyn.csv >> merge.csv
	tail -n +2 csv/Queens.csv >> merge.csv
	tail -n +2 "csv/Staten Island.csv" >> merge.csv

plan_table: merge_csvs
	csvcut -c "Borough,Name of Plan,Date Adopted,Status,Expiration,Last Updated" merge.csv | uniq > plans.csv

add_to_cartodb: geojson plan_table
	python add_to_cartodb.py --plans plans.csv --lots lots.geojson

plan_geojsons: geojson plan_table
	rm -rf geojson/us/ny/nyc/*
	mkdir -p geojson/us/ny/nyc
	python create_plan_geojsons.py --plans plans.csv --lots lots.geojson --dst geojson/us/ny/nyc
	python create_borough_geojsons.py --plans plans.csv --lots lots.geojson --dst geojson/us/ny/nyc
	cp lots.geojson geojson/us/ny/nyc/nyc.geojson

create_plan_pages: plan_table
	python create_plan_pages.py --dst ../plans --plans plans.csv

append_plan_summaries: create_plan_pages
	# This summaries file is in Google Drive
	python append_plan_summaries.py --dst ../plans --summaries "Plan summaries.csv"
