export default {
    /// General ///
    home: "Home",
    login: "Login",
    logout: "Logout",
    register: "Register",
    password: "Password",
    passwords: "Passwords",
    email: "Email",
    phone: "Phone",
    identifier: "Identifier",
    info_perso: "Personal Information",
    firstname: "First Name",
    lastname: "Last Name",
    valid: "Validate",
    OR: "OR",
    new: "New",
    verif_code: "Verification Code",
    cancel: "Cancel",
    return: "Return",
    are_you_sure: "Are you sure?",
    /// APP ///

    ///// project //////
    roles: {
        "admin-company": "Administrator",
        supervisor: "Supervisor/Department Head",
        user: "User",
        title: "Roles",
        add_role: "Add Role",
        edit_role: "Edit Role",
        name: "Role Name",
        powerhelp: "You can assign or modify only roles with power equal to or less than yours",
        power: "Power"
    },
    users: {
        title: "Users",
        add_user: "Add User",
        edit_user: "Edit User",
        invite_user: "Invite User",
        search: "Search User",
        role_required: "Role is required",
        name: "Name",
        help_user_id: "",
        add_invite: "Add Line",
        invite: "Invite User(s)",
        invited: "Invitations Sent",
        user: "Add/Edit User",
        confirm_invite: 'Do you want to join the company "{company}"'
    },
    profil: {
        title: "Profile",
        edited: "Profile successfully edited",
        lang_edited: "Language successfully edited",
        avatar_upload: "Upload Profile Picture",
        avatar_upload_success: "Avatar successfully updated",
        avatar_upload_error: "An error occurred while updating the avatar",
    },
    auth: {
        pincode_error: "The entered code is invalid!",
        valid_code: "Validate Code",
        title_pincode: "Confirm Validation Code",
        help_pincode: "Please enter the validation code sent to your email (check your spam folder)",
        rgpd: "I agree with ",
        rgpdlink1: "the terms of use",
        rgpdlink2: "and the privacy policy",
        confirm_password: "Confirm Password",
        valid_register: "Create My Account",
        have_account: "I already have an account",
        have_account_login: "I log in",
        signin_google: "Sign in with Google",
        pass_forgot: "Forgot Password?",
        valid_login: "Log In",
        not_have_account: "I don't have an account",
        not_have_account_register: "I create an account",
        recovery_help_step1:
            "You lost your password or have trouble logging in. No worries! Enter your identifier below and we will send you a code that will allow you to log in and change your password if you wish.",
        valid_recovery: "Send Code",
        stay_log: "Stay Logged In",
        pincode_help: "We just sent you a temporary code (valid for 10 minutes) by email.",
        pincode_help2: "Please check your spam folder and enter the code below.",
        pincode_help_editpassword: "To validate the password change, enter the code sent to {identifier} (check your spam folder)",
        resend_code: "Didn't receive it? Resend code",
        edit_password: "Change Password",
        password_edited: "Password successfully changed",
        '2FA': {
            invalid_qrcode: "Invalid QRCode",
            you_must_be_logged_in: "You must be logged in to manage your 2FA.",
            login: "Log In",
            manage_my_2fa: "Manage My Two-Factor Authentication.",
            '2FA_enabled': "Two-Factor Authentication (2FA)",
            note_the_recovery_code:
                "Note the following code: it is the recovery code, usable in case you lose your authenticator",
            show_qrcode: "Show My QRCode",
            your_qrcode: "Your QRCode (to scan with Authy or Google Authenticator)",
            activate_2fa_by_validating_code:
                "To activate your 2FA, please validate by entering your authentication code in the field below.",
            validate_your_2fa: "Validate Your 2FA",
            disable2fa: "Remove Two-Factor Authentication",
            disabledSuccess: "Two-Factor Authentication successfully removed",
            enabledSuccess: "Two-Factor Authentication successfully enabled"
        }
    },
    error: {
        default: "An error occurred, please try again later or contact support",
        verification: "The entered verification code is invalid. Please check your information and try again.",
        form: "Please correct the errors in red.",
        title: "Oops, an error occurred",
        rgpd: "You must accept the terms of use and privacy policy",
        creation_failed: "Creation failed",
        unauthorized: "Sorry, you are not authorized to access this resource",
        userdisabled: "Your account is disabled, please contact your manager.",
        duplicate: "Sorry, an identical element already exists",
        badcredential: "Invalid identifier or password!",
        password_notedited: "The password could not be changed",
        user_missing_metas: "User information missing",
        filesize: "The file size is too large",
        filetype: "The file format is incorrect",
        filenotfound: "File not found",
        lang_not_edited: "Language not changed",
        profil_notedited: "Profile not changed",
        userexistwithrole: "This role is currently assigned to at least one user/invitee, it can only be deleted once it is no longer assigned to anyone.",
        not_enough_power: "Your role does not have the required power to perform this action.",
        not_good_profile: "You do not have the necessary profile to perform this action",
        DuplicateKey: "Sorry, this element already exists!",
        method_disallowed: "Method not allowed",
        entity_is_locked: "This entity is locked and cannot be updated",
        unowned_entity: "You do not own this entity.",
        bad_request: "Bad arguments transmitted",
        not_authenticated: "You are not authenticated.",
        forbidden: "Operation forbidden",
    },
    langs: {
        fr: "French",
        en: "English"
    },
    zod: {
        errors: {
            identifier_missing: "An email or phone identifier is required",
            specialchar: "{number} special character(s) required",
            capitalchar: "{number} uppercase letter(s) required",
            password_mismatch: "Passwords do not match",
            invalid_type: "Invalid type: {expected} expected, but {received} received",
            invalid_type_received_undefined: "Required",
            invalid_literal: "Value must be {expected}",
            unrecognized_keys: "One or more unrecognized key(s) in the object: {keys}",
            invalid_union: "Value does not match",
            invalid_union_discriminator: "Invalid discriminator value. Expected options: {options}",
            invalid_enum_value: "Value '{received}' does not exist in options: {options}",
            invalid_arguments: "Function received invalid arguments",
            invalid_return_type: "Function returned an invalid type",
            invalid_date: "Invalid date",
            custom: "Invalid field",
            invalid_intersection_types: "Intersection results could not be merged",
            not_multiple_of: "Number must be a multiple of {multipleOf}",
            not_finite: "Number must be finite",
            not_id: "Identifier is not a mongo ID.",
            rgpd: "You must accept the terms of use and privacy policy",
            invalid_string: {
                email: "Invalid email format",
                url: "Invalid {validation}",
                uuid: "Invalid {validation}",
                cuid: "Invalid {validation}",
                regex: "Invalid {validation}",
                datetime: "Invalid {validation}",
                startsWith: 'Invalid field: must start with "{startsWith}"',
                endsWith: 'Invalid field: must end with "{endsWith}"'
            },
            too_small: {
                array: {
                    exact: "List must contain exactly {minimum} element(s)",
                    inclusive: "List must contain at least {minimum} element(s)",
                    not_inclusive: "List must contain more than {minimum} element(s)"
                },
                string: {
                    exact: "{minimum} character(s) required",
                    inclusive: "{minimum} character(s) minimum required",
                    not_inclusive: "More than {minimum} character(s) required"
                },
                number: {
                    exact: "Number must be equal to {minimum}",
                    inclusive: "Number must be greater than or equal to {minimum}",
                    not_inclusive: "Number must be greater than {minimum}"
                },
                set: {
                    exact: "Invalid field",
                    inclusive: "Invalid field",
                    not_inclusive: "Invalid field"
                },
                date: {
                    exact: "Date must be equal to {minimum}, {datetime}",
                    inclusive: "Date must be greater than or equal to {minimum}, {datetime}",
                    not_inclusive: "Date must be greater than {minimum}, {datetime}"
                }
            },
            too_big: {
                array: {
                    exact: "List must contain exactly {maximum} element(s)",
                    inclusive: "List must contain at most {maximum} element(s)",
                    not_inclusive: "List must contain less than {maximum} element(s)"
                },
                string: {
                    exact: "This field must contain exactly {maximum} character(s)",
                    inclusive: "This field must contain at most {maximum} character(s)",
                    not_inclusive: "This field must contain less than {maximum} character(s)"
                },
                number: {
                    exact: "Number must be equal to {maximum}",
                    inclusive: "Number must be less than or equal to {maximum}",
                    not_inclusive: "Number must be less than {maximum}"
                },
                set: {
                    exact: "Invalid field",
                    inclusive: "Invalid field",
                    not_inclusive: "Invalid field"
                },
                date: {
                    exact: "Date must be equal to {maximum}, {datetime}",
                    inclusive: "Date must be less than or equal to {maximum}, {datetime}",
                    not_inclusive: "Date must be less than {maximum}, {datetime}"
                }
            },
        },
        validations: {
            email: "email",
            url: "link",
            uuid: "UUID",
            cuid: "CUID",
            regex: "regular expression",
            datetime: "datetime"
        },

        types: {
            function: "function",
            number: "number",
            string: "string",
            nan: "NaN",
            integer: "integer",
            float: "float",
            boolean: "boolean",
            date: "date",
            bigint: "bigint",
            undefined: "undefined",
            symbol: "symbol",
            null: "null",
            array: "array",
            object: "object",
            unknown: "unknown",
            promise: "promise",
            void: "void",
            never: "never",
            map: "map",
            set: "set"
        }
    },
    websites: "Websites"
};
