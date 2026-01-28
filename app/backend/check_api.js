async function checkApi() {
    try {
        const res = await fetch('http://localhost:3000/api/categorias');
        const categories = await res.json();

        const calCategory = categories.find(c => c.tipo === 'CALIFICACION');
        if (!calCategory) {
            console.log('No se encontró ninguna categoría de tipo CALIFICACION');
            return;
        }

        console.log(`Chequeando items para categoría: ${calCategory.nombre} (ID: ${calCategory.id})`);
        const itemRes = await fetch(`http://localhost:3000/api/items-calificables?categoryId=${calCategory.id}`);
        const data = await itemRes.json();

        // El backend devuelve { items: [], total: 0 }
        console.log('Respuesta de items:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error reaching API:', e.message);
    }
}
checkApi();
