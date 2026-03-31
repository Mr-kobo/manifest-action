import moment from "moment-timezone";

export default () => {
    const truncate = (text: string, nb: number) => `${text.substring(0, nb)} ${text.length > nb ? ' ...' : ''}`

    const formatDateTodayOrNot = (date: any): string => {
        if (!date) {
            return "";
        }
        const momentDate = moment(date);
        return moment(momentDate).isSame(moment(), 'day') ?  momentDate.format('HH:mm') : momentDate.format('DD/MM');
    };

    return {
        truncate,
        formatDateTodayOrNot
    }
}