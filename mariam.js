function detectValueType(value) {
    const text = String(value).trim();
    if (text === "") {
        return "string";
    }

    const lower = text.toLowerCase();
    if (lower === "true" || lower === "false") {
        return "boolean";
    }

    const integerPattern = /^[+-]?\d+$/;
    const floatPattern = /^[+-]?(?:\d*\.\d+|\d+\.\d*)(?:[eE][+-]?\d+)?$/;

    if (integerPattern.test(text)) {
        return "integer";
    }

    if (floatPattern.test(text)) {
        return "float";
    }

    return "string";
}

// أمثلة للاستخدام
console.log(detectValueType("123"));    // integer
console.log(detectValueType("45.67"));  // float
console.log(detectValueType("hello"));  // string
console.log(detectValueType("  -8  ")); // integer
console.log(detectValueType("3.0"));    // float
