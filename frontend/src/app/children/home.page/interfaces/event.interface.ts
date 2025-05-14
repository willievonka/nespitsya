export interface IEvent {
    id: number;
    cityId: number;
    placeId: number;
    organizerId: number;
    image: string;
    title: string;
    description: string;
    place: string;
    dateStart: Date;
    dateEnd: Date;
    price: number;
    tags: Array<{ id: number; name: string }>;
}