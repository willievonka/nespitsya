import { ICity } from '../../../interfaces/city.interface';


export interface IPopularCity extends ICity {
    shortName: string,
    backgroundUrl: string,
}