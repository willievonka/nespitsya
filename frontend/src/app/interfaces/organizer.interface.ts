import { IUser } from './user.interface';


export interface IOrganizer extends IUser {
    subsCount: string,
    eventsCount: string
}