import { Image } from '../models/sync/sync.js';
import sharp from 'sharp';

// Servir imagen desde la BD
export async function serveImage(req, res) {
    try {
        const image = await Image.findByPk(req.params.imageId);
        if (!image || !image.file) return res.status(404).send('Imagen no encontrada');
        res.set('Content-Type', 'image/jpeg');
        res.send(image.file);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar imagen');
    }
}

// Función auxiliar reutilizable para aplicar marca de agua
export async function aplicarMarcaAgua(buffer, texto) {
    const imagen = sharp(buffer);
    const { width, height } = await imagen.metadata();
    const fontSize = Math.max(24, Math.floor(width / 20));

    const svgMarca = `
        <svg width="${width}" height="${height}">
            <rect x="0" y="${height - fontSize * 2}"
                  width="${width}" height="${fontSize * 2}"
                    fill="rgba(0,0,0,0.45)"/>
            <text
                x="${width / 2}" y="${height - fontSize * 0.4}"
                text-anchor="middle"
                font-size="${fontSize}px"
                font-family="Arial"
                font-weight="bold"
                fill="rgba(255,255,255,0.85)"
                stroke="rgba(0,0,0,0.3)"
                stroke-width="1"
            >© ${texto}</text>
        </svg>`;

    return await imagen
        .composite([{ input: Buffer.from(svgMarca), top: 0, left: 0 }])
        .jpeg({ quality: 90 })
        .toBuffer();
}