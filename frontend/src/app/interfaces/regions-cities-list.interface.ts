export interface IRegionsCitiesList {
    groups: IRegionsGroup[];
}

export interface IRegionsGroup {
    name: string;
    regions: IRegion[];
}

export interface IRegion {
    name: string;
    cities: ICity[];
}

export interface ICity {
    id: number;
    name: string;
}
