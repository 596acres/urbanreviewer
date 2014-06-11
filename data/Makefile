pluto_dir = ${PLUTO_DIR}
sqlite_db = working.db

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

shps:
	mkdir -p shp

	-sqlite3 $(sqlite_db) 'DROP TABLE Bronx'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Bronx.csv
	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, b.* FROM BXMapPLUTO p INNER JOIN Bronx b on b.BBL=p.BBL" shp/Bronx.shp $(sqlite_db)

	-sqlite3 $(sqlite_db) 'DROP TABLE Brooklyn'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Brooklyn.csv
	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, b.* FROM BKMapPLUTO p INNER JOIN Brooklyn b on b.BBL=p.BBL" shp/Brooklyn.shp $(sqlite_db)

	-sqlite3 $(sqlite_db) 'DROP TABLE Manhattan'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Manhattan.csv
	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, b.* FROM MNMapPLUTO p INNER JOIN Manhattan b on b.BBL=p.BBL" shp/Manhattan.shp $(sqlite_db)

	-sqlite3 $(sqlite_db) 'DROP TABLE Queens'
	-csvsql --db sqlite:///$(sqlite_db) --insert csv/Queens.csv
	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, b.* FROM QNMapPLUTO p INNER JOIN Queens b on b.BBL=p.BBL" shp/Queens.shp $(sqlite_db)

	-sqlite3 $(sqlite_db) "DROP TABLE 'Staten Island'"
	-csvsql --db sqlite:///$(sqlite_db) --insert "csv/Staten Island.csv"
	ogr2ogr -overwrite -f "ESRI Shapefile" -sql "SELECT p.GEOMETRY, b.* FROM SIMapPLUTO p INNER JOIN 'Staten Island' b on b.BBL=p.BBL" "shp/Staten Island.shp" $(sqlite_db)

merge:
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
	ogr2ogr -f "GeoJSON" -sql "SELECT Block AS block, Lot AS lot, \"Name of Pl\" AS plan_name FROM simplified" lots.geojson shp/simplified.shp

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
