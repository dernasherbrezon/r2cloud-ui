#!/bin/bash

set -e

DATE=$(date '+%Y%m%d%H%M%S')

echo "Version: ${DATE}" >> debian/DEBIAN/control

dpkg-deb --build debian r2cloud-ui-${DATE}.deb

openssl aes-256-cbc -K $encrypted_ace8744cfeee_key -iv $encrypted_ace8744cfeee_iv -in codesigning.asc.enc -out codesigning.asc -d
gpg --fast-import codesigning.asc

deb-s3 upload -c r2cloud --access-key-id=${AWS_ACCESS_KEY} --secret-access-key=${AWS_SECRET_ACCESS_KEY}  -m main --sign=A5A70917 --gpg-options="--passphrase ${GPG_PASSPHRASE} --digest-algo SHA256" --bucket r2cloud *.deb
deb-s3 upload -c stretch --access-key-id=${AWS_ACCESS_KEY} --secret-access-key=${AWS_SECRET_ACCESS_KEY}  -m main --sign=A5A70917 --gpg-options="--passphrase ${GPG_PASSPHRASE} --digest-algo SHA256" --bucket r2cloud *.deb
deb-s3 upload -c buster --access-key-id=${AWS_ACCESS_KEY} --secret-access-key=${AWS_SECRET_ACCESS_KEY}  -m main --sign=A5A70917 --gpg-options="--passphrase ${GPG_PASSPHRASE} --digest-algo SHA256" --bucket r2cloud *.deb
deb-s3 upload -c bionic --access-key-id=${AWS_ACCESS_KEY} --secret-access-key=${AWS_SECRET_ACCESS_KEY}  -m main --sign=A5A70917 --gpg-options="--passphrase ${GPG_PASSPHRASE} --digest-algo SHA256" --bucket r2cloud *.deb
deb-s3 upload -c focal --access-key-id=${AWS_ACCESS_KEY} --secret-access-key=${AWS_SECRET_ACCESS_KEY}  -m main --sign=A5A70917 --gpg-options="--passphrase ${GPG_PASSPHRASE} --digest-algo SHA256" --bucket r2cloud *.deb
