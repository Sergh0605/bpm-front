export const formData = (document, file, objName) => {
    let bodyFormData = new FormData();
    const json = JSON.stringify(document);
    const blob = new Blob([json], {type: 'application/json'})
    bodyFormData.append(objName, blob);
    bodyFormData.append('file', file);
    return bodyFormData;
}

export const downloadFile = (response) => {
    let filename = decodeURIComponent(response.headers['content-disposition'].split('filename*=UTF-8\'\'')[1]);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}