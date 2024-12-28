#!/bin/bash
# Browse into './build/' directory
cd build
# Create './user/' directory
echo '1/4 Create "siera.ai" directory'
mkdir siera.ai
echo '2/4 Move relevant files'
find . | grep -Ev '^.$|^.\/siera.ai|^.\/static\/.+' | xargs -I{} mv -v {} user
# Browse into './user/' directory
cd siera.ai
# Find all files within the folder (not subfolders)
# Replace string 'static/' with 'user/static/' on all files that match the 'find'
# ('sed' requires one to create backup files on OSX, so we do that)
echo '3/4 Replace file references'
find . -type f -maxdepth 1 | LC_ALL=C xargs -I{} sed -i.html -e 's,static/,siera.ai/static/,g' {}
# Delete '*.backup' files created in the last process
#echo '4/4 Clean up'
#find . -name '*.backup' -type f -delete
# Done