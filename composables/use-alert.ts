import { ToastProps } from "#ui/types";

enum AlertTypes {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info'
}

export default () => {
    const toast = !isServer()? useToast(): null;
    const { t } = useI18n();

    async function alert(type: AlertTypes, message: string, params: Partial<ToastProps> = {}) {
        if (toast) {
            let color: "success" | "error" | "info" | "primary" | "secondary" | "accent" | "warning" | "neutral" | undefined = undefined;
            let icon: string | undefined = undefined;
            switch (type) {
                case AlertTypes.SUCCESS:
                    color = 'success';
                    icon = 'mdi-check-circle';
                    break;
                case AlertTypes.ERROR:
                    color = 'error';
                    icon = 'mdi-alert-circle';
                    break;
                case AlertTypes.INFO:
                    color = 'info';
                    icon = 'mdi-information';
                    break;
            }
            toast.add({
                title: t(message),
                color,
                icon,
                ...params
            })
        }
    }

    return {
        info: async (message: string) => {
            return await alert(AlertTypes.INFO, message);
        },
        error: async (message: string) => {
            return await alert(AlertTypes.ERROR, message);
        },
        success: async (message: string) => {
            console.log('successs')
            return await alert(AlertTypes.SUCCESS, message);
        }
    }
}