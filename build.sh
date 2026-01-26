echo "starting build"
echo "cleaning up older build"
rm -rf dist/
rm -rf ~/dp/me/devendraprasad1984.github.io/assets/
echo "building..."
pnpm run build
cp -r dist/ ~/dp/me/devendraprasad1984.github.io
echo "success. completed"
