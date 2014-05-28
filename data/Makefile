all: simplify

# Merging shapefiles:
#  ogr2ogr -update -append merge.shp "5S - 3rd Revision.shp" -nln merge
# rinse, wash, repeat


simplify:
	ogr2ogr -simplify 0.2 -t_srs EPSG:4326 -overwrite simplified.shp merge.shp

geojson: simplify
	rm lots.geojson
	ogr2ogr -f "GeoJSON" -select Borough,Block,Lot,"URPC-R3-_3" lots.geojson simplified.shp

plan_table:
	csvcut -c "Name of Plan,Date Adopted,Status,Expiration,Last Updated" 20140524.csv | uniq > plans.csv

add_to_cartodb:
	python add_to_cartodb.py --plans plans.csv --lots lots.geojson
