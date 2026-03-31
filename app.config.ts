export enum ConfigAuthProvider {
    CREDENTIALS,
    PASSWORDLESS,
    GOOGLE
};

export enum ConfigIdentifier {
    PHONE,
    EMAIL,
    BOTH
};

export enum AppPermissions {
    ROOT = '*',
    // APP AUTH
};

export default defineAppConfig({
    ui: {
        colors: {
            primary: "mariner",
            secondary: "bright-sun",
            accent: "pumpkin",
            error: "flamingo",
            info: "mariner",
            success: "emerald",
            warning: "tangerine"
        }
    },
    // CUSTOM 
    langs: ['fr', 'en'],
    auth: {
        identifier: ConfigIdentifier.EMAIL,
        tokenExpiration: 60,
        providers: [ConfigAuthProvider.PASSWORDLESS, ConfigAuthProvider.CREDENTIALS, ConfigAuthProvider.GOOGLE],
        verification: false,
        twofa: false,
        register: true,
        profil: true
    },
    upload_presets: {
        'images': {
            accept: ['image/jpg', 'image/jpeg', 'image/png'],
            quality: 80
        },
        'avatar': {
            size: 100000,
            quality: 70,
            resize: {
                width: 100,
                height: 100,
                fit: 'contain'
            }
        }
    },
})