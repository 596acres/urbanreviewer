pluto_dir = ${PLUTO_DIR}
sqlite_db = working.db

select_boroughs = CAST(b.BBL as text) AS BBL, b.Borough AS borough, b.Block AS block, b.Lot AS lot, b.'Name of Plan' AS plan_name

select_dispositions = b.filterable_disposition AS disp_filt, b.edited_disposition AS disp_edit

join_596 = LEFT OUTER JOIN '596_lots' fns ON fns.bbl= b.BBL
select_596 = (fns.bbl IS NOT NULL) AS in_596

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

load_596:
	-sqlite3 $(sqlite_db) "DROP TABLE '596_lots'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "596_lots.csv"

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

	-sqlite3 $(sqlite_db) "DROP TABLE 'Staten Island'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "csv/Staten Island.csv"
	python add_dispositions.py --borough "Staten Island" --db $(sqlite_db)

shps: load_lots load_596
	mkdir -p shp

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596) FROM BXMapPLUTO p INNER JOIN Bronx b ON b.BBL=p.BBL $(join_596)" shp/Bronx.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596) FROM BKMapPLUTO p INNER JOIN Brooklyn b ON b.BBL=p.BBL $(join_596)" shp/Brooklyn.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596) FROM MNMapPLUTO p INNER JOIN Manhattan b ON b.BBL=p.BBL $(join_596)" shp/Manhattan.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596) FROM QNMapPLUTO p INNER JOIN Queens b ON b.BBL=p.BBL $(join_596)" shp/Queens.shp $(sqlite_db)

	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, $(select_boroughs), $(select_dispositions), $(select_596) FROM SIMapPLUTO p INNER JOIN 'Staten Island' b ON b.BBL=p.BBL $(join_596)" "shp/Staten Island.shp" $(sqlite_db)

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
	ogr2ogr -f "GeoJSON" -sql "SELECT BBL, block, lot, plan_name, disp_filt AS disposition_filterable, disp_edit AS disposition_display, in_596 FROM simplified" lots.geojson shp/simplified.shp

plan_table:
	# TODO Take borough CSVs, concatenate into one big CSV
	csvcut -c "Borough,Name of Plan,Date Adopted,Status,Expiration,Last Updated" 20140610.csv | uniq > plans.csv

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
