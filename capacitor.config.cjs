/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
    appId: 'com.vyloslabs.app',
    appName: 'Vylos Labs',
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#050505',
            showSpinner: false
        },
        StatusBar: {
            style: 'dark',
            backgroundColor: '#050505'
        }
    }
};

module.exports = config;
