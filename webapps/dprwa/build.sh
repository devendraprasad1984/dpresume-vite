echo "starting build"
echo "cleaning up older build"
rm -rf build/
echo "building..."
#npm run build
yarn build
#echo "deploying to server"
#cp -R build/ /Volumes/dpresume.com/httpdocs
#echo "cleaning up"
#rm -rf build/
#npx gulp
echo "success. completed"
