import { ICity } from '../../../interfaces/city.interface';


export interface IRegion {
    name: string;
    cities: ICity[];
}