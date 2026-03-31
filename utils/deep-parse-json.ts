const deepParseJson = (obj: Object) : Object => {
    if (typeof obj === "string") {
        try {
            return deepParseJson(JSON.parse(obj));
        } catch {
            return obj;
        }
    }

    if (Array.isArray(obj)) {
        return obj.map(deepParseJson);
    }

    if (typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, deepParseJson(value)])
        );
    }
    
    return obj;
}
export default deepParseJson;