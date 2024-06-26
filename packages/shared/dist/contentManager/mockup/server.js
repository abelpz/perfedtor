export const serverMap = {
    door43: {
        unfoldingWord: {
            en: {
                ult: {
                    psa: {
                        file: import("../../data/psa.usfm").then((data) => data.default),
                    },
                    rut: {
                        file: import("../../data/rut.usfm").then((data) => data.default),
                    },
                },
            },
        },
    },
    dbl: {
        bfbs: {
            fra: {
                lsg: {
                    tit: {
                        file: import("../../data/tit.usfm").then((data) => data.default),
                    },
                },
            },
        },
    },
    ebible: {
        wbt: {
            en: {
                t4t: {
                    gen: {
                        file: import("../../data/gen.usfm").then((data) => data.default),
                    },
                },
            },
        },
    },
};
