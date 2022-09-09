export function getQueryString() {
    let result = new Map<String, String>();
    const query = document.location.search.split("?").reverse()[0];
    query.split("&").forEach((it) => {
        result = result.set(it.split("=")[0],it.split("=")[1])
    })
    return result;
}