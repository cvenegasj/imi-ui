export class Client {
    id?: string;
    email: string = '';
    companyName: string = '';
    description?: string;
    phone?: string;
    website?: string;
    extraUrls?: string[] = [];
    countries: string[] = [];
    industries: string[] = [];
    imis: Imi[] = [];

    //constructor();
    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.email = data.email;
            this.companyName = data.companyName;
            this.description = data.description;
            this.phone = data.phone;
            this.website = data.website;
            this.extraUrls = data.extraUrls;
            this.countries = data.countries;
            this.industries = data.industries;
            this.imis = data.imis;
        }
    }
}

export class Provider {
    id?: string;
    email: string = '';
    companyName: string = '';
    description?: string;
    phone?: string;
    website?: string;
    extraUrls?: string[] = [];
    countries: string[] = [];
    industries: string[] = [];
    imis: Imi[] = [];
    services: Map<number, string[]> = new Map();

    //constructor();
    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.email = data.email;
            this.companyName = data.companyName;
            this.description = data.description;
            this.phone = data.phone;
            this.website = data.website;
            this.extraUrls = data.extraUrls;
            this.countries = data.countries;
            this.industries = data.industries;
            this.imis = data.imis;
            this.services = data.services;
        }
    }
}

export class Academic {
    id?: string;
    email: string = '';
    companyName: string = '';
    type: string = '';
    description?: string;
    phone?: string;
    website?: string;
    extraUrls?: string[] = [];
    countries: string[] = [];
    imis: Imi[] = [];

    //constructor();
    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.email = data.email;
            this.companyName = data.companyName;
            this.type = data.type;
            this.description = data.description;
            this.phone = data.phone;
            this.website = data.website;
            this.extraUrls = data.extraUrls;
            this.countries = data.countries;
            this.imis = data.imis;
        }
    }
}

export class Imi {
    vars: Map<number, number> = new Map();
    dateTime?: Date;
}

export interface DimensionsType {
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
    height: number
    width: number
    boundedHeight?: number
    boundedWidth?: number
  }