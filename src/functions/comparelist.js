const storage = window.localStorage;


export class CompareListService {

    constructor() {
        this.maxLength = 4
    }

    isExist = (item, container) => {
        if(container.length){
            let i = 0;
            container.forEach((value) => {
                if (item.id === value.id) {
                    i++;
                }
            });
            return i !== 0
        }
    };

    isFull = (container) => {
        return container ? container.length >= this.maxLength : false;
    };

}
