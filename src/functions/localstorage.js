const storage = window.localStorage;

export default function localStorage(carData) {

}

export function setToLStorage(dataIndex, dataValue) {

    let storageArr = [],
        storageData = getFromLStorage(dataIndex);
    if (!storageData) {
        storageArr.push(dataValue);
        sendToLStorage(dataIndex, storageArr);
    } else {
        storageArr = storageData;
        if (isItemExist(storageArr, dataValue)) {
            // Max Length For The Ad Compare Page
            if (!isStoreFull(dataIndex, 4)) {
                storageArr.push(dataValue);
                sendToLStorage(dataIndex, storageArr);
            } else {
                // When Store Is Full Will Send First of arr
                storageArr.unshift(dataValue);
                storageArr.pop();
                sendToLStorage(dataIndex, storageArr);

            }
        } else {
            console.log('Bu ilan zaten karşılaştırma listenizde bulunmakta.')
        }
    }
}

export function removeFromLStorage(dataIndex, itemIndex) {
    let payload = getFromLStorage(dataIndex);
        payload.splice(itemIndex, 1);
        return payload;
}

export function isStoreFull(dataIndex, maxLen) {
    const storageData = getFromLStorage(dataIndex);

    return storageData.length >= maxLen;
}

export function isItemExist(arr, dataValue) {
    const dataId = dataValue.id;
    let isUnique = true;
    arr.forEach(function (ad) {
        if (ad.id === dataId) isUnique = false;
    });
    return isUnique;
}

export function sendToLStorage(dataIndex, dataValue) {
    storage.setItem(dataIndex, JSON.stringify(dataValue));
    console.log('Data Send To Local Storage', dataValue);
    return dataIndex;
}

export function getFromLStorage(itemName) {
    let payload = JSON.parse(storage.getItem(itemName));
    return payload ? payload.length ? payload : [] : [];
}

