/* -----
Centralized configuration for the React Native Admin App
Prevents hardcoded secrets and paths in operational logic
----- */
export const appConfig = {
    // Replace YOUR_LOCAL_IP with your actual IPv4 address (e.g., 192.168.1.X)
    apiBaseUrl: "https://printify.infinityfree.io/php",
    serverBaseUrl: "https://printify.infinityfree.io",
    firebaseDatabaseUrl: "https://printify-45d48-default-rtdb.firebaseio.com",

    // UI Settings
    shopName: "Printify Studio Admin",
};