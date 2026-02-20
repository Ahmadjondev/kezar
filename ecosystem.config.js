module.exports = {
    apps: [
        {
            name: "kezar-backend",
            cwd: "/home/inventory/kezar/backend",
            interpreter: "/home/inventory/kezar/backend/.venv/bin/python",
            script: "-m",
            args: "uvicorn app.main:app --host 127.0.0.1 --port 8012",
            env: {
                DATABASE_URL: "sqlite+aiosqlite:///./kezar.db",
                CORS_ORIGINS: '["https://kezar.soften.uz","http://127.0.0.1:3004"]',
                UPLOAD_DIR: "uploads",
            },
            max_restarts: 10,
            restart_delay: 3000,
        },
        {
            name: "kezar-frontend",
            cwd: "/home/inventory/kezar/frontend",
            script: "node_modules/.bin/next",
            args: "start -p 3004",
            env: {
                NODE_ENV: "production",
                NEXT_PUBLIC_API_URL: "https://kezar.soften.uz",
            },
            max_restarts: 10,
            restart_delay: 3000,
        },
    ],
};
