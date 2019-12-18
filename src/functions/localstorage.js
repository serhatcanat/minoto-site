export const LocalStorageItem = {
    compareList: {
        key: 'compareList',
        type: 'object'
    },

    lvpList: {
        key: 'lvp',
        type: 'object'
    }
};

export class LocalStorageService {

    get = (item) => item.type === 'object'
        ? JSON.parse(localStorage.getItem(item.key))
        : localStorage.getItem(item.key);

    set = (item, value) => {
        item.type === 'object'
            ? localStorage.setItem(item.key, JSON.stringify(value))
            : localStorage.setItem(item.key, value);
    }


    delete = (item) => localStorage.removeItem(item.key);


    update = (item, value) => {
        if (item.type !== 'object')
            return this.set(item, value);

        const current = this.get(item) || [];
        const updated = [
            ...current,
            value
        ];

        return this.set(item, updated);
    };

    unshift = (item,value,pop=false) => {
        if (item.type !== 'object')
            return this.set(item, value);

        let current = this.get(item) || [];
        if(pop){
            current.pop()
        }
        const updated = [
            value,
            ...current
        ];

        return this.set(item, updated);
    };
}

