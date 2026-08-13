import path from "path";
import { fileURLToPath } from "url";
import { closeDb, getDb, withTransaction } from "./db.js";
import { getBusinessDate } from "../utils/date.js";

const DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
const VENTANA_DIAS = 8; // hoy + los proximos 7 dias

// Cada plato se ofrece 2 dias fijos por semana (mezclados entre si). Los datos
// del plato (descripcion, tipo, precio, cupoDiario, imagenUrl) se toman de la
// fila mas reciente que ya exista con ese nombre, asi que si se edita el precio
// o el cupo desde el panel admin, las proximas fechas heredan el cambio.
const PATRONES_DISPONIBILIDAD = [
    { nombre: "Milanesa con pure",    dias: ["lunes", "jueves"] },
    { nombre: "Tarta de verduras",    dias: ["martes", "viernes"] },
    { nombre: "Bowl vegano",          dias: ["miercoles", "sabado"] },
    { nombre: "Pollo al horno",       dias: ["lunes", "viernes"] },
    { nombre: "Pasta con salsa",      dias: ["martes", "jueves"] },
    { nombre: "Ensalada proteica",    dias: ["sabado", "lunes"] },
    { nombre: "Curry de garbanzos",   dias: ["jueves", "sabado"] },
    { nombre: "Lasagna de berenjena", dias: ["miercoles", "viernes"] },
    { nombre: "Merluza con papas",    dias: ["martes", "sabado"] },
    { nombre: "Bondiola braseada",    dias: ["jueves", "lunes"] },
];

function construirVentana() {
    const hoy = getBusinessDate();
    const [year, month, day] = hoy.split("-").map(Number);
    const base = new Date(Date.UTC(year, month - 1, day));

    const fechas = Array.from({ length: VENTANA_DIAS }, (_, i) => {
        const dt = new Date(base);
        dt.setUTCDate(base.getUTCDate() + i);
        return { fecha: dt.toISOString().slice(0, 10), dia: DIAS[dt.getUTCDay()] };
    });

    return { hoy, fechas };
}

export async function syncMenuAvailability() {
    const db = await getDb();
    const { hoy, fechas: ventana } = construirVentana();

    let creados = 0;

    await withTransaction(async (txDb) => {
        for (const patron of PATRONES_DISPONIBILIDAD) {
            const plantilla = await txDb.get(
                "SELECT descripcion, tipo, precio, cupoDiario, imagenUrl FROM menus WHERE nombre = ? ORDER BY id DESC LIMIT 1",
                [patron.nombre]
            );
            if (!plantilla) continue; // el plato todavia no existe en el catalogo

            const fechasQueCorresponden = ventana
                .filter(v => patron.dias.includes(v.dia))
                .map(v => v.fecha);

            for (const fecha of fechasQueCorresponden) {
                const existe = await txDb.get("SELECT id FROM menus WHERE nombre = ? AND fecha = ?", [patron.nombre, fecha]);
                if (existe) continue;

                await txDb.run(
                    `INSERT INTO menus (nombre, descripcion, fecha, tipo, precio, cupoDiario, activo, imagenUrl)
                     VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
                    [patron.nombre, plantilla.descripcion, fecha, plantilla.tipo, plantilla.precio, plantilla.cupoDiario, plantilla.imagenUrl]
                );
                creados++;
            }
        }
    });

    // Los menus con fecha ya pasada se desactivan (no se borran, para no romper
    // pedidos/historial existentes) para que dejen de listarse como disponibles.
    const { changes: desactivados } = await db.run(
        "UPDATE menus SET activo = 0 WHERE fecha < ? AND activo = 1",
        [hoy]
    );

    console.log(`Disponibilidad de menus sincronizada (ventana desde ${hoy}). Creados: ${creados}. Desactivados por vencidos: ${desactivados}.`);
    return { hoy, creados, desactivados };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    syncMenuAvailability()
        .catch(error => {
            console.error("Error sincronizando disponibilidad de menus:", error);
            process.exitCode = 1;
        })
        .finally(closeDb);
}
