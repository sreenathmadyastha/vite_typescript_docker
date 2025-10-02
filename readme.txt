docker build -t my-app .
docker run -p 5000:5000 my-app


Install dependencies:

npm install

Test locally:

Build the client:

cd client
npm run build
ls -la ../server/public
Verify that server/public/index.html exists and contains references to bundled JS/CSS files.
Run the server:
cd server
npm run start
Access http://localhost:5000 to see the React app and http://localhost:5000/api/message 
for the API response.


Build and run with Docker:
docker build -t my-app .
docker run -p 5000:5000 my-app
Check the build log for ls -la /app/client (should include index.html) and cat /app/server/public/index.html (should show the built HTML).

Key Chang