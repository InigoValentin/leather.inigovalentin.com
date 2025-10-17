#!/bin/bash
dimensions=( 100 200 300 400 500 600 700 800 900 1000 );
cd $(dirname "$0")
pwd;
rm -rf images_scaled;
mkdir -p images_scaled;

for dimension in "${dimensions[@]}";
do
	echo Generating x$dimension...;
	mkdir -p images_scaled/x${dimension};
	cp -rf images/* images_scaled/x$dimension/;
	cd images_scaled/x$dimension/;
	for file in $(find  -type f);
	do
		type=$(file -b --mime-type $file);
		if [ "image" == "${type:0:5}" ];
		then
			#echo "IMAGE: ${file}";
			convert $file -resize $dimension"x"${dimension}\> ${file}
		fi
	done;
	cd ../../
done;
