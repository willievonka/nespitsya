import { CityDeclensionPipe } from './city-declension.pipe';

describe('CityDeclensionPipe', () => {
    it('create an instance', () => {
        const pipe: CityDeclensionPipe = new CityDeclensionPipe();
        expect(pipe).toBeTruthy();
    });
});
