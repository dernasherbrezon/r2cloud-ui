#!/bin/bash

DATE=`date +%s`

echo "Version: ${DATE}" >> debian/DEBIAN/control

dpkg-deb --build debian r2cloud-ui-${DATE}.deb
