export default {
    /// General ///
    home: "Accueil",
    login: "Connexion",
    logout: "Déconnexion",
    register: "Inscription",
    password: "Mot de passe",
    passwords: "Mots de passe",
    email: "Email",
    phone: "Téléphone",
    identifier: "Identifiant",
    info_perso: "Informations personnelles",
    firstname: "Prénom",
    lastname: "Nom",
    valid: "Valider",
    OR: "OU",
    new: "nouveau",
    verif_code: "Code de vérification",
    cancel: "Annuler",
    return: "Retour",
    are_you_sure: "Êtes-vous sûr ?",
    /// APP ///
    products: {
        title: "Produits",
        new: "Nouveau produit",
    },

    ///// project //////
    roles: {
        "admin-company": "Administrateur",
        supervisor: "Superviseur/Chef de service",
        user: "Utilisateur",
        title: "Roles",
        add_role: "Ajouter un rôle",
        edit_role: "Modifier un rôle",
        name: "Nom du role",
        powerhelp: "Vous pouvez attribuer ou modifier uniquement les rôles avec un pouvoir inférieur ou égale au votre",
        power: "Pouvoir"
    },
    users: {
        title: "Utilisateurs",
        add_user: "Ajouter un utilisateur",
        edit_user: "Modifier un utilisateur",
        invite_user: "Inviter un utilisateur",
        search: "Chercher un utilisateur",
        role_required: "Le rôle est requis",
        name: "Nom",
        help_user_id: "",
        add_invite: "Ajouter une ligne",
        invite: "Inviter du/des utilisateur(s)",
        invited: "Invitations envoyées",
        user: "Ajouter/editer un utilisateur",
        confirm_invite: 'Voulez-vous rejoindre la société "{company}"'
    },
    profil: {
        title: "Profil",
        edited: "Profil modifié avec succés",
        lang_edited: "Langue modifiée avec succés",
        avatar_upload: "Télécharger une photo de profil",
        avatar_upload_success: 'L\'avatar a été mis a jour avec succés',
        avatar_upload_error: 'Une erreur est survenue lors de la mise à jour de l\'avatar',
    },
    auth: {
        pincode_error: "Le code saisie est invalide !",
        valid_code: "Valider le code",
        title_pincode: "Confirmer le code de validation",
        help_pincode: "Veuillez saisir le code de validation envoyé sur votre email (verifiez aussi vos spams)",
        rgpd: "Je suis d'accord avec ",
        rgpdlink1: "les conditions d'utilisation",
        rgpdlink2: "et les règles de confidentialité",
        confirm_password: "Confirmez le mot de passe",
        valid_register: "Créer mon compte",
        have_account: "J'ai déjà un compte",
        have_account_login: "je me connecte",
        signin_google: "Se connecter avec Google",
        pass_forgot: "Mot de passe oublié ?",
        valid_login: "Me connecter",
        not_have_account: "Je n'ai pas de compte",
        not_have_account_register: "je crée un compte",
        recovery_help_step1:
            "Vous avez perdu votre mot de passe ou des difficultés à vous connecter. Pas de soucis ! saisissez votre identifiant ci-dessous nous vous enverrons un code qui vous permettra de vous connecter puis changer votre mot de passe si vous le désirez.",
        valid_recovery: "Envoyer le code",
        stay_log: "Rester connecter",
        pincode_help: "Nous venons de vous envoyer un code temporaire (valide 10mn) par email.",
        pincode_help2: "Veuillez vérifier vos spams et saisir le code ci-dessous.",
        pincode_help_editpassword: "Pour valider la modification du mot de passe, saississez le code envoyé sur {identifier} (verifiez vos spams)",
        resend_code: "Pas réçu ? renvoyer le code",
        edit_password: "Modifier le mot de passe",
        password_edited: "Mot de passe modifié avec succés",
        '2FA': {
            invalid_qrcode: "QRCode invalide",
            you_must_be_logged_in: "Vous devez être connecté pour gérer votre 2FA.",
            login: "Me connecter",
            manage_my_2fa: "Gérer mon authentification à 2 facteurs.",
            '2FA_enabled': "Authentification à 2 facteurs (2FA)",
            note_the_recovery_code:
                "Notez bien le code suivant: il s'agit du code de secours, utilisable au cas où vous perdriez votre authentificateur",
            show_qrcode: "Voir mon QRCode",
            your_qrcode: "Votre QRCode (à scanner avec Authy ou Google Authenticator)",
            activate_2fa_by_validating_code:
                "Afin d'activer votre 2FA, veuillez valider en entrant votre code d'authentification dans le champ ci-dessous.",
            validate_your_2fa: "Validez votre 2FA",
            disable2fa: "Supprimer l'authentification à 2 facteurs",
            disabledSuccess: "L'authentification à 2 facteurs a été supprimé avec succés",
            enabledSuccess: "L'authentification à 2 facteurs a été activée avec succés"
        }
    },
    error: {
        default: "Une erreur est survenue, veuillez réessayer plus tard ou contacter le support",
        verification: "Le code de vérification saisi est invalide. Veuillez vérifier vos informations et réessayer.",
        form: "Veuillez corriger les erreurs en rouge.",
        title: "Ooops, une erreur est survenue",
        rgpd: "Vous devez accepter les conditions d'utilisation et règles de confidentialité",
        creation_failed: "La création a échoué",
        unauthorized: "Désolé vous n'êtes pas autorisé à acceder à cette ressource",
        userdisabled: "Votre compte est désactivé, veuillez contacter votre responsable.",
        duplicate: "Désolé un element identique existe déjà",
        badcredential: "Identifiant ou mot de passe invalide !",
        password_notedited: "Le mot de passe n'a pas pu être modifié",
        user_missing_metas: "Informations sur l'utilisateur manquantes",
        filesize: "Le poids du fichier est trop elevé",
        filetype: "Le fromat du fichier est incorrecte",
        filenotfound: "Le fichier est introuvable",
        lang_not_edited: "Langue non modifiée",
        profil_notedited: "Profil non modifié",
        userexistwithrole: "Ce rôle est actuellement assigné à au moins un utilisateur/invité, il ne pourra être supprimé qu'une fois qu'il ne sera plus attribué à personne.",
        not_enough_power: "Votre rôle n'a pas le pouvoir requis pour effectuer cette action.",
        not_good_profile: "Vous n'avez pas le profil necessaire pour effectuer cette action",
        DuplicateKey: "Désolé cet element existe déjà !",
        method_disallowed: "Méthode non authorisé",
        entity_is_locked: "Cette entité est vérouillée et ne peut être mis à jour",
        unowned_entity: "Vous ne possedez pas cette entité.",
        bad_request: "Mauvais arguments transmis",
        not_authenticated: "Vous n'êtes pas authentifié.",
        forbidden: "Opération interdite",
        oauthsignin: "Erreur lors de la connexion avec le fournisseur d'authentification AZURE",
    },
    langs: {
        fr: "Français",
        en: "Anglais"
    },
    zod: {
        errors: {
            identifier_missing: "Un identifiant email ou téléphone est obligatoire",
            specialchar: "{number} caractère(s) special(aux) requis",
            capitalchar: "{number} majuscule(s) requis(es)",
            password_mismatch: "Le mot de passe n'est pas identique",
            invalid_type: "Type invalide: {expected} doit être fourni(e), mais {received} a été reçu(e)",
            invalid_type_received_undefined: "Obligatoire",
            invalid_literal: "Valeur doit être {expected}",
            unrecognized_keys: "Une ou plusieurs clé(s) non reconnue(s) dans l'objet: {keys}",
            invalid_union: "Valeur ne correspond pas",
            invalid_union_discriminator: "La valeur du discriminateur est invalide. Options attendus: {options}",
            invalid_enum_value: "Valeur '{received}' n'existe pas dans les options: {options}",
            invalid_arguments: "Fonction a reçu des arguments invalides",
            invalid_return_type: "Fonction a retourné un type invalide",
            invalid_date: "Date invalide",
            custom: "Champ invalide",
            invalid_intersection_types: "Les résultats d'intersection n'ont pas pu être fusionnés",
            not_multiple_of: "Nombre doit être multiple de {multipleOf}",
            not_finite: "Nombre doit être fini",
            not_id: "L'identifiant n'est pas un mongo ID.",
            rgpd: "Vous devez accepter les conditions d'utilisation et règles de confidentialité",
            invalid_string: {
                email: "Le format de l'email est invalide",
                url: "{validation} invalide",
                uuid: "{validation} invalide",
                cuid: "{validation} invalide",
                regex: "{validation} invalide",
                datetime: "{validation} invalide",
                startsWith: 'Champ invalide: doit commencer par "{startsWith}"',
                endsWith: 'Champ invalide: doit se terminer par "{endsWith}"'
            },
            too_small: {
                array: {
                    exact: "Liste doit contenir exactement {minimum} élément(s)",
                    inclusive: "Liste doit contenir au moins {minimum} élément(s)",
                    not_inclusive: "Liste doit contenir plus de {minimum} élément(s)"
                },
                string: {
                    exact: "{minimum} caractère(s) requis",
                    inclusive: "{minimum} caractère(s) minimum requis",
                    not_inclusive: "plus de {minimum} caractère(s) requis"
                },
                number: {
                    exact: "Nombre doit être égale à {minimum}",
                    inclusive: "Nombre doit être supérieur ou égale à {minimum}",
                    not_inclusive: "Nombre doit être supérieur à {minimum}"
                },
                set: {
                    exact: "Champ invalide",
                    inclusive: "Champ invalide",
                    not_inclusive: "Champ invalide"
                },
                date: {
                    exact: "Date doit être égale à {minimum}, {datetime}",
                    inclusive: "Date doit être supérieure ou égale à {minimum}, {datetime}",
                    not_inclusive: "Date doit être supérieure à {minimum}, {datetime}"
                }
            },
            too_big: {
                array: {
                    exact: "Liste doit contenir exactement {maximum} élément(s)",
                    inclusive: "Liste doit contenir au plus {maximum} élément(s)",
                    not_inclusive: "Liste doit contenir moins de {maximum} élément(s)"
                },
                string: {
                    exact: "Ce champ doit contenir exactement {maximum} caractère(s)",
                    inclusive: "Ce champ doit contenir au plus {maximum} caractère(s)",
                    not_inclusive: "Ce champ doit contenir moins de {maximum} caractère(s)"
                },
                number: {
                    exact: "Nombre doit être égale à {maximum}",
                    inclusive: "Nombre doit être inférieur ou égale à {maximum}",
                    not_inclusive: "Nombre doit être inférieur à {maximum}"
                },
                set: {
                    exact: "Champ invalide",
                    inclusive: "Champ invalide",
                    not_inclusive: "Champ invalide"
                },
                date: {
                    exact: "Date doit être égale à {maximum}, {datetime}",
                    inclusive: "Date doit être inférieure ou égale à {maximum}, {datetime}",
                    not_inclusive: "Date doit être inférieure à {maximum}, {datetime}"
                }
            },
        },
        validations: {
            email: "email",
            url: "lien",
            uuid: "UUID",
            cuid: "CUID",
            regex: "expression régulière",
            datetime: "horodate"
        },

        types: {
            function: "fonction",
            number: "nombre",
            string: "chaîne de caractères",
            nan: "NaN",
            integer: "entier",
            float: "décimal",
            boolean: "booléen",
            date: "date",
            bigint: "grand entier",
            undefined: "undefined",
            symbol: "symbole",
            null: "null",
            array: "liste",
            object: "objet",
            unknown: "inconnu",
            promise: "promise",
            void: "void",
            never: "never",
            map: "map",
            set: "ensemble"
        }
    },
    websites: "Sites web"
};
