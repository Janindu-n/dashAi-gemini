How to get the messenger <-> gemini API (or LLM api running)

0. Make sure to upload the environment files to the VM, this application needs a firebase-key for firestore authentication and .env file conatining PORT to expose, meta PAGE_ACCESS_TOKEN, meta VERIFY_TOKEN, GEMINI_API_KEY (if using demo version), FIREBASE_PROJECT_ID.


1. Create a docker network first: docker network create my-app-network
a.Go to your VM and pull the docker image using : docker pull janindu1234/dash-messenger-gemini:latest
b. run docker image with: docker run -d   --network dash-network   --name dash-messenger-app   --env-file ./messenger.env   -v "$(pwd)/firebase-key.json:/usr/src/app/firebase-key.json"   janindu1234/dash-messenger-gemini:latest
c. run caddy (only backend), save the following in the Caddyfile: {
    reverse_proxy dash-messenger-app:8080
}
d. run: docker run -d \
  --network dash-network \
  --name caddy-proxy \
  -p 80:80 \
  -p 443:443 \
  -v "$(pwd)/Caddyfile:/etc/caddy/Caddyfile" \
  -v caddy_data:/data \
  caddy:latest

2. Messenger api requires you to have a HTTPS enebaled endpoint to interact with its api. For this expose the VM's public IP and connect the incoming requests to a port using Caddy or for local development use ngrok simply exposing a port to a public ngrok provided endpoint for testing. 

3. Enter credentials in the Meta busness suite page (Messeneger or Whatsapp APIs), make sure to subscribe to the messing fucntion 