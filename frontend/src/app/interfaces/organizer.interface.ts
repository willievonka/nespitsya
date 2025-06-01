import { IUser } from './user.interface';


export interface IOrganizer extends IUser {
    subsCount: number,
    eventsCount: number
}