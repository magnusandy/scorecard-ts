export interface Service {
    id: string;
    name: string;
    owner: string;
    vertical: string;
}
export function getAllServices(): Service[] {
    return [{
        id: "1",
        name: "bankService",
        owner: "finance-reporting",
        vertical: "finance",
    },
    {
        id: "2",
        name: "googleService",
        owner: "google pay",
        vertical: "google",
    },
    {
        id: "3",
        name: "bingService",
        owner: "bing",
        vertical: "microsoft",
    }
    ];
}