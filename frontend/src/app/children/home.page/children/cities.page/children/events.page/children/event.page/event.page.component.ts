import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBreadcrumbsComponent } from '../../../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { OrganizerCardComponent } from './components/organizer-card/organizer-card.component';
import { TuiSecondaryButtonComponent } from '../../../../../../components/tui-components/tui-secondary-button/tui-secondary-button.component';
import { IEvent } from '../../../../../../interfaces/event.interface';
import { IOrganizer } from '../../../../../../interfaces/organizer.interface';
import { TuiAppearance, TuiIcon } from '@taiga-ui/core';
import { MapComponent } from './components/map/map.component';
import { EventPageService } from './services/event-page.service';


@Component({
    selector: 'app-event-page',
    imports: [
        TuiBreadcrumbsComponent,
        EventCardComponent,
        OrganizerCardComponent,
        TuiSecondaryButtonComponent,
        TuiIcon,
        TuiAppearance,
        MapComponent,
    ],
    templateUrl: './event.page.component.html',
    styleUrl: './event.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPageComponent {
    public event: IEvent = {
        id: 1,
        cityId: 14,
        placeId: 1,
        organizerId: 7,
        image: 'https://i.imgur.com/5qSSGHi.jpeg',
        title: 'Оркестр CAGMO | Концерт при свечах',
        description: '«Вальс-Бостон» — музыкальная сага длиною в жизнь.\n\nИстория о роковой случайности, изменившей жизнь, о любви, пронесенной через годы испытаний, и о прошлом, которое нельзя стереть, но можно переосмыслить.\n\nДобро пожаловать в Ростов-на-Дону 20-х годов прошлого века.\nМесто, где культурная жизнь городских интеллигентов переплетается с манящим угаром криминального мира. Здесь легко потерять голову, но ещё легче потерять себя. Это не просто мюзикл, а криминальная драма и головокружительный роман.\n\nО чём история?\n\nКонстантин (Ромаш), талантливый студент-медик, однажды случайно спасает жизнь вору и открывает для себя криминальный мир Ростова-на-Дону. Благодаря своим новым знакомым он встречает любовь всей своей жизни. Что несет эта случайная встреча: погибель или спасение? Может ли быть счастлив тот, кто пошел на сделку с совестью?\n\nГероям предстоит узнать, как уживаются полное беззаконие и настоящая мужская дружба, любовь к девушке, которой нет места в этом опасном мире, с долгом перед теми, кто помог тебе обрести свое счастье, какова цена ошибки и можно ли ее искупить? Жизнь — это череда нелепых случайностей или действительно судьба предопределена?\n\nИменно об этом песни Александра Розенбаума, которые легли в основу нашей истории. «Вальс-Бостон» — размышление о человеческих судьбах, о людях, их чувствах, потерях и мечтах. Песни Александра Розенбаума — не просто саундрек к истории героев, это — диалог со зрителем, приглашение к размышлению о дружбе и любви, верности и предательстве, молодости и взрослении. Попытка ответить на вопрос «кто мы с тобою здесь на самом деле»?',
        place: 'Детская филармония',
        dateStart: new Date('2025-05-14T19:00:00'),
        dateEnd: new Date('2025-05-15T22:00:00'),
        price: 1500,
        tags:  [
            { id: 1, name: 'Классическая музыка' }, 
            { id: 2, name: 'Саундтрек' }, 
            { id: 3, name: 'Неоклассика' }, 
            { id: 4, name: 'Шоу' }, 
            { id: 5, name: 'Концерт' }
        ],
    };

    public organizer: IOrganizer = {
        id: 1,
        name: 'Oleg Tinkoff',
        image: 'https://i.imgur.com/5qSSGHi.jpeg',
        role: 'organizer',
        subsCount: 9,
        eventsCount: 7
    };

    public regionCityLocation: string = 'Свердловская область, Екатеринбург, улица 8 Марта, 36';

    public breadcrumbsItems: Array<{ caption: string, routerLink: string }> = [
        { caption: 'Главная', routerLink: '/home' }, 
        { caption: 'Города', routerLink: '/home/cities' }, 
        { caption: 'Город', routerLink: `/home/cities/${this.event.cityId}` }, 
        { caption: this.event.title, routerLink: `/home/cities/${this.event.cityId}/${this.event.id}` }
    ];

    constructor(private _eventPageService: EventPageService) {}
}
