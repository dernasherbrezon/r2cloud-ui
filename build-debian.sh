#!/bin/bash

DATE=`date +%s`
echo "building r2cloud-ui-${DATE}"

echo "Version: ${DATE}" >> debian/DEBIAN/control

dpkg-deb --build debian r2cloud-ui-${DATE}.deb
