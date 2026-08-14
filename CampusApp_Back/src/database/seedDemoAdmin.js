import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { closeDb, getDb } from "./db.js";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from "../config/env.js";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

export async function seedDemoAdmin() {
    if (!DEMO_ADMIN_EMAIL || !DEMO_ADMIN_PASSWORD) {
        throw new Error("DEMO_ADMIN_ENABLED=true requiere DEMO_ADMIN_EMAIL y DEMO_ADMIN_PASSWORD.");
    }

    const db = await getDb();
    const normalizedEmail = DEMO_ADMIN_EMAIL.trim().toLowerCase();

    const existente = await db.get("SELECT id FROM usuarios WHERE LOWER(email) = ?", [normalizedEmail]);
    if (existente) {
        console.log("Admin demo ya existe. No se recrea.");
        return { created: false };
    }

    const passwordHash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, BCRYPT_ROUNDS);
    await db.run(
        "INSERT INTO usuarios (nombre, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)",
        ["Admin Demo", normalizedEmail, passwordHash, "admin", 1]
    );

    console.log(`Admin demo creado: ${normalizedEmail}`);
    return { created: true };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    seedDemoAdmin()
        .catch(error => {
            console.error("Error creando admin demo:", error);
            process.exitCode = 1;
        })
        .finally(closeDb);
}
