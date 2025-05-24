export interface IUser {
    id: number;
    image: string;
    username: string;
    email: string;
    role: string;
    subscriptions?: number[];
    favorites?: number[];
}