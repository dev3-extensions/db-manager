async function loadSchemas(): Promise<any> {
    const response = await fetch('../../../schemas.json');
    const data = await response.json();
    return data;
}

loadSchemas().then((data) => {
    console.log(data);
});
