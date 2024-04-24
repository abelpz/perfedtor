export declare namespace env {
    let browser: boolean;
    let es2021: boolean;
}
declare let _extends: string[];
export { _extends as extends };
export declare let overrides: {
    env: {
        node: boolean;
    };
    files: string[];
    parserOptions: {
        sourceType: string;
    };
}[];
export declare let parser: string;
export declare namespace parserOptions {
    let ecmaVersion: string;
    let sourceType: string;
}
export declare let plugins: string[];
export declare let rules: {
    "react/react-in-jsx-scope": string;
};
