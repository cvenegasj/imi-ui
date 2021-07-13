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

    calculateIMI(): number {
        if (this.imis.length === 0) { return 0; }
        const lastImi = this.imis[this.imis.length - 1];
        const n = lastImi.vars.size;
        let sum = 0;

        for (let value of lastImi.vars.values()) {
            sum += value;
        }
        return sum / n;
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

    calculateIMI(): number {
        if (this.imis.length === 0) { return 0; }
        const lastImi = this.imis[this.imis.length - 1];
        const n = lastImi.vars.size;
        let sum = 0;

        for (let value of lastImi.vars.values()) {
            sum += value;
        }
        return sum / n;
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