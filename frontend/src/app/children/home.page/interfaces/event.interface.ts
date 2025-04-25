export interface IEvent {
    id: number;
    cityId: number;
    placeId: number;
    image: string;
    title: string;
    description: string;
    place: string;
    date: Date;
    price: string;
    tags: string[];
    routerLink: string;
}