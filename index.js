const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Cloud computing and big data are transforming the way we store, process, and analyze data.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});