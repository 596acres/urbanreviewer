merge:
	rm -f shp/merge.*
	ogr2ogr -update -append shp/merge.shp "shp/Prototype_Bronx.shp" -nln merge -lco ENCODING=UTF-8
	ogr2ogr -update -append shp/merge.shp "shp/Prototype_Brooklyn.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/Prototype_Manhattan.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/Prototype_Queens.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/Prototype_Staten_Island.shp" -nln merge

simplify: merge
	ogr2ogr -simplify 0.2 -t_srs EPSG:4326 -overwrite shp/simplified.shp shp/merge.shp -lco ENCODING=UTF-8

geojson: simplify
	rm -f lots.geojson
	ogr2ogr -f "GeoJSON" -sql "SELECT Block AS block, Lot AS lot, \"Prototyp_3\" AS plan_name FROM simplified" lots.geojson shp/simplified.shp

plan_table:
	csvcut -c "Borough,Name of Plan,Date Adopted,Status,Expiration,Last Updated" 20140601.csv | uniq > plans.csv

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
