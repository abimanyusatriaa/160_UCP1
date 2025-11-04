const express = require('express');
const app = express();
const db = require('./models');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sinkronisasi database dan jalankan server
db.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// CREATE (POST)
app.post('/kandang', async (req, res) => {
    try {
        const data = req.body;
        const kandang = await db.Kandang.create(data);
        res.status(201).json({
            message: 'Kandang berhasil ditambahkan',
            data: kandang
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE (PUT)
app.put('/kandang/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const kandang = await db.Kandang.findByPk(id);
        if (!kandang) {
            return res.status(404).json({ message: 'Komik tidak ditemukan' });
        }

        await kandang.update(data);
        res.json({
            message: 'Komik berhasil diperbarui',
            data: kandang
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE
app.delete('/kandang/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({ message: 'Kandang tidak ditemukan' });
        }

        await komik.destroy();
        res.json({ message: 'Kandang berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET semua komik
app.get('/kandang', async (req, res) => {
    try {
        const komik = await db.Komik.findAll();
        res.json({
            message: 'Daftar semua kandang',
            data: komik
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});