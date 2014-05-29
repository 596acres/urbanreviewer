merge:
	rm -f shp/merge.*
	ogr2ogr -update -append shp/merge.shp "shp/1M - 3rd Revision.shp" -nln merge -lco ENCODING=UTF-8
	ogr2ogr -update -append shp/merge.shp "shp/2B - 3rd Revision.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/3B - 3rd Revision.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/4Q - 3rd Revision.shp" -nln merge
	ogr2ogr -update -append shp/merge.shp "shp/5S - 3rd Revision.shp" -nln merge

simplify: merge
	ogr2ogr -simplify 0.2 -t_srs EPSG:4326 -overwrite shp/simplified.shp shp/merge.shp -lco ENCODING=UTF-8

geojson: simplify
	rm -f lots.geojson
	ogr2ogr -f "GeoJSON" -sql "SELECT Block AS block, Lot AS lot, \"URPC-R3-_3\" AS plan_name FROM simplified" lots.geojson shp/simplified.shp

plan_table:
	csvcut -c "Borough,Name of Plan,Date Adopted,Status,Expiration,Last Updated" 20140524.csv | uniq > plans.csv

add_to_cartodb: geojson plan_table
	python add_to_cartodb.py --plans plans.csv --lots lots.geojson
