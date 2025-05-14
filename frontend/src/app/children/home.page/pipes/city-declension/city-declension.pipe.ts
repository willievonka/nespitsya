import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'cityDeclension'
})
export class CityDeclensionPipe implements PipeTransform {

    /**
     * Transforms a city name into its declension form based on specific rules.
     * @param city - The name of the city to be transformed.
     * @returns The transformed city name in its declension form.
     */
    public transform(city: string): string {
        if (!city) {
            return city;
        }

        const moreThanOneWord: RegExp = /[А-Яа-я]\s[А-Яа-я]/u; // Город с пробелами (например, "Нижний Новгород")
        const dashedWord: RegExp = /[А-Яа-я]-(на)-[А-Яа-я]/uig; // Город с дефисами (...-на-...) (например, "Ростов-на-Дону")

        if (moreThanOneWord.test(city)) {
            // Если город состоит из нескольких слов
            const cityArray: string[] = city.split(' ');

            return cityArray.map(this.regcheck).join(' ');
        } else if (dashedWord.test(city)) {
            // Если город содержит дефисы (...-на-...)
            const cityArray: string[] = city.split('-');
            cityArray[0] = this.regcheck(cityArray[0]);

            return cityArray.join('-');
        } else {
            // Обычный город
            return this.regcheck(city);
        }
    }

    /**
     * Applies specific declension rules to transform a city name.
     * @param city - The name of the city to be transformed.
     * @returns The transformed city name based on declension rules.
     */
    private regcheck(city: string): string {
        if (/а$/.test(city) || /ль$/.test(city) || /ня$/.test(city) || /ея$/.test(city) 
            || /ля$/.test(city) || /зя$/.test(city) || /ай$/.test(city)) {
            return city.slice(0, -1) + 'е';
        } else if (/р$/.test(city) || /ск$/.test(city) || /д$/.test(city) || /ш$/.test(city) 
            || /ж$/.test(city) || /ов$/.test(city) || /ан$/.test(city) || /цк$/.test(city)
            || /г$/.test(city) || /ул$/.test(city) || /ток$/.test(city) 
            || /оп$/.test(city) || /с$/.test(city) || /т$/.test(city)
            || /еп$/.test(city) || /ин$/.test(city) || /ик$/.test(city)
            || /ен$/.test(city) || /ол$/.test(city) || /ом$/.test(city)
            || /ач$/.test(city) || /п$/.test(city) || /он$/.test(city)
            || /як$/.test(city) || /уз$/.test(city) || /ян$/.test(city)
            || /ак$/.test(city) || /ф$/.test(city)) {
            return city + 'е';
        } else if (/рь$/.test(city) || /мь$/.test(city) || /ия$/.test(city) || /нь$/.test(city) || /шь$/.test(city)) {
            return city.slice(0, -1) + 'и';
        } else if (/ний$/.test(city)) {
            return city.slice(0, -2) + 'ем';
        } else if (/кий$/.test(city) || /ый$/.test(city) || /ое$/.test(city)) {
            return city.slice(0, -2) + 'ом';
        } else if (/жок$/.test(city)) {
            return city.slice(0, -2) + 'ке';
        } else if (/кое$/.test(city)) {
            return city.slice(0, -2) + 'ом';
        } else if (/ел$/.test(city)) {
            return city.slice(0, -2) + 'ле';
        } else if (/ы$/.test(city) || /и$/.test(city)) {
            return city.slice(0, -1) + 'ах';
        } else if (/лец$/.test(city)) {
            return city.slice(0, -3) + 'льце';
        } else if (/ец$/.test(city)) {
            return city.slice(0, -2) + 'це';
        } else if (/яя$/.test(city)) {
            return city.slice(0, -2) + 'ей';
        } else if (/ая$/.test(city)) {
            return city.slice(0, -2) + 'ой';
        } else if (/ие$/.test(city)) {
            return city.slice(0, -1) + 'х';
        } else {
            return city;
        }
    }
}
