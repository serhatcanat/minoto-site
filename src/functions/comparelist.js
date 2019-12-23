export class CompareListService {

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

    isFull = (container,maxLength = 4) => {
        return container ? container.length >= maxLength : false;
    };

}
