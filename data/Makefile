all: simplify

# Merging shapefiles:
#  ogr2ogr -update -append merge.shp "5S - 3rd Revision.shp" -nln merge
# rinse, wash, repeat


simplify:
	ogr2ogr -simplify 0.2 -t_srs EPSG:4326 -overwrite simplified.shp merge.shp

geojson:
	rm -f lots.geojson
	ogr2ogr -f "GeoJSON" -sql "SELECT Block AS block, Lot AS lot, \"URPC-R3-_3\" AS plan_name FROM simplified" lots.geojson simplified.shp

plan_table:
	csvcut -c "Borough,Name of Plan,Date Adopted,Status,Expiration,Last Updated" 20140524.csv | uniq > plans.csv

add_to_cartodb:
	python add_to_cartodb.py --plans plans.csv --lots lots.geojson
