#!/bin/bash

DATE=`date +%s`

echo "Version: ${DATE}" >> debian/DEBIAN/control

dpkg-deb --build debian r2cloud-ui-${DATE}.deb

deb-s3 upload -a armhf -c r2cloud --access-key-id=${AWS_ACCESS_KEY} --secret-access-key=${AWS_SECRET_ACCESS_KEY}  -m main --sign=27679FBF --gpg-options="--passphrase ${GPG_PASSPHRASE}" --bucket r2cloud *.deb
