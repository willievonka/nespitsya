export interface IEvent {
    image: string;
    title: string;
    description?: string;
    place: string;
    date: Date;
    price: string;
    tags: string[];
    routerLink: string;
}