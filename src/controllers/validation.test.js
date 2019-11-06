import {defaultMessages, validation} from "./validation";

// emailErr: "Geçerli bir e-posta girmelisiniz.",
// fullNameErr: "Geçerli bir ad-soyad girmelisiniz",
// IDErr: "Geçerli bir kimlik no. girmelisiniz.",
// requiredErr: "Bu alanı doldurmalısınız.",
// minNumErr: "Bu alan {amount} değerinden küçük olmamalıdır.",
// maxNumErr: "Bu alan {amount} değerinden büyük olmamalıdır.",
// minLengthErr: "Bu alan en fazla {length} karakter içermelidir.",
// maxLengthErr: "Bu alan en fazla {length} karakter içermelidir.",
// minWordsErr: "Bu alan en az {length} kelime içermelidir.",
// maxWordsErr: "Bu alan en fazla {length} kelime içerebilir.",
// compareErr: "İki alan birbiri ile eşleşmiyor.",
// fileRequiredErr: "Bu alanı doldurmalısınız.",
// dateErr: "Geçerli bir tarih girmelisiniz.",
// creditcardErr: "Geçerli bir kart numarası girmelisiniz.",
// cvcErr: "Geçerli bir CVC numarası girmelisiniz.",
// expiryErr: "Geçerli bir son kullanma tarihi girmelisiniz."


describe('Is entry valid', () => {
    test('element required', () => {
        expect(validation('g', {required: true})).toBe(false)
        expect(validation('', {required: 'message'})).toBe('message')
        expect(validation('', {required: true})).toBe(defaultMessages.requiredErr)
    });

    test('Is Email', () => {
        const faultyEntries = ['test', '', 24, '%./``@asffsa', 'test.com', '@.com', 'test@.com', 'test?@mail.com', '@test.com'];
        stringEntryCheck('test@mail.com', faultyEntries, 'email')
    });

    test('Is Full Name', () => {
        const faultyEntries = ['test', '', 24, '%./``@asffsa'];
        stringEntryCheck('john doe', faultyEntries, 'fullName')
    });

    // T.C. kimlik numaraları 11 hanedir ve tamamı rakamsal değerlerden oluşur.
    // T.C. kimlik numarasının ilk hanesi sıfır(0) olamaz.
    // 1. 3. 5. 7. ve 9. hanelerin toplamının 7 ile çarpımından 2. 4. 6. ve 8. haneler çıkartıldığında geriye kalan sayının 10′a göre modu bize 10. haneyi verir.
    // 1. 2. 3. 4. 5. 6. 7. 8. 9. 10. hanelerin toplamının 10′a göre modu bize 11. haneyi verir.
    test('Is id card valid', () => {
        const faultyEntries = ['61023600801','asdfghjklqw','00000000000','%./','','61023600896'];
        stringEntryCheck('61023600806', faultyEntries, 'ID')
    });

    test('Is number < gap', () => {
        const message= 'En az 15 seçebilirsiniz.';
        lengthChecker(16,12,'minNum',15,message)
    });

    test('Is number > gap', () => {
        const message= 'En fazla 15 seçebilirsiniz.';
        lengthChecker(13,16,'maxNum',15,message)
    });

    it('Is text length < gap', () => {
        const testStr ='test string'; // Char count : 11
        const testStr1 ='test string extra'; // Char count : 17
        const message= 'En az 15 karakter girebilirsiniz.';
        lengthChecker(testStr1,testStr,'minLength',15,message)
    });

    it('Is text length > gap', () => {
        const testStr ='test string'; // Char count : 11
        const testStr1 ='test string extra'; // Char count : 17
        const message= 'En fazla 15 karakter girebilirsiniz.';
        lengthChecker(testStr,testStr1,'maxLength',15,message)
    });

    it('Is word length < gap', () => {
        const testStr ='test string'; // Word count : 2
        const testStr1 ='test string extra test'; // Word count : 4
        const message= 'En az 3 kelime girebilirsiniz.';
        lengthChecker(testStr1,testStr,'minWords',3,message)
    });

    it('Is word length > gap', () => {
        const testStr ='test string'; // Word count : 2
        const testStr1 ='test string extra test'; // Word count : 4
        const message= 'En fazla 3 kelime girebilirsiniz.';
        lengthChecker(testStr,testStr1,'maxWords',3,message)
    });
})

function stringEntryCheck(correctEntry, faultyEntries, entryName) {
    expect(validation(correctEntry, {[entryName]: true})).toBe(false);
    let entryErrMessage = `${entryName}Err`;
    faultyEntries.forEach(function (entry, j) {
        expect(validation(entry, {[entryName]: 'Correct Message'})).toBe('Correct Message');
        expect(validation(entry, {[entryName]: true})).toBe(defaultMessages[entryErrMessage])
    })
}


function lengthChecker(correctEntry, faultyEntry, entryName,limit,message) {
    expect(validation(faultyEntry, {[entryName]: [message,limit],})).toBe(message);
    expect(validation(correctEntry, {[entryName]: [message,limit],})).toBe(false);
}
